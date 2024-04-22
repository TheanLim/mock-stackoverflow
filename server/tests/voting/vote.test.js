// Unit tests for controller/vote.js
const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const timekeeper = require('timekeeper');
const bcrypt = require("bcrypt");

const Vote = require("../../models/votes");
const User = require("../../models/users");
const Question = require("../../models/questions");
const Answer = require("../../models/answers");
const Comment = require("../../models/comments");
const { votingActionInfo, handleVoteReputation} =  require("../../utils/reputation");
const { addVote, MAX_FLAGS, MAX_CLOSE_REOPEN} = require("../../utils/vote");

let server;
let session;
const SALT_ROUNDS = 10;
const DEFAULT_REPS = 100;

// for mocking session
jest.mock("../../models/users");
jest.mock("bcrypt");
jest.mock('csurf', () => jest.fn((options) => {
  return (req, res, next) => {
    req.csrfToken = () => 'mockCSRFToken123'; // Mock CSRF token function
    next();
  };
}));

describe("addVote Helper function", () => {
  let req, res, user, postOwner, post;

  beforeEach(() => {
    req = {
      session: {
        user: new mongoose.Types.ObjectId(),
      },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    user = {
      _id: req.session.user,
      reputation: DEFAULT_REPS, 
      save: jest.fn(),
    };
    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS, 
      save: jest.fn(),
    };
    post = {
      _id: new mongoose.Types.ObjectId(),
      postOwner: postOwner,
      votes: [],
      save: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCreateVote = async(newVoteType, existingVoteType=null, insufficientRep=false) => {
    user.reputation = votingActionInfo[newVoteType].reputation - insufficientRep
    req.body = { id: post._id, vote_type: newVoteType};

    User.findById = jest.fn().mockResolvedValue(user);
    Vote.create = jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
    Vote.deleteOne = jest.fn().mockResolvedValue();
    
    // Loop through each Post type
    let Posts = [Question, Answer, Comment]
    let existingVote;
    for (let Post of Posts) {
      if (existingVoteType) {
        existingVote = { _id: new mongoose.Types.ObjectId(), vote_type: existingVoteType, voter: user._id };
        post.votes.push(existingVote);
      }

      Post.findById = jest.fn().mockImplementation(
        () => ({ 
          populate: jest.fn().mockImplementation(
            () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
          )
        })
      );

      await addVote(req, res, Post);

      expect(User.findById).toHaveBeenCalledWith(req.session.user);
      expect(Post.findById).toHaveBeenCalledWith(post._id);
      
      // Existing but conflicting votes --> Create the new vote
      if(existingVoteType) {
        if (existingVoteType ===newVoteType){
          // Revert: Simply delete the existing
          expect(Vote.deleteOne).toHaveBeenCalledWith({ _id: existingVote._id });
        } else { // Revert and create the new vote
          // UnAuthorized to create a new vote
          if (insufficientRep){
            expect(res.status).toHaveBeenCalledWith(401);
            expect(post.votes).toHaveLength(1); // remains the same vote count
          } else {
            expect(Vote.deleteOne).toHaveBeenCalledWith({ _id: existingVote._id });
            expect(res.json).toHaveBeenCalledWith(post);
            expect(Vote.create).toHaveBeenCalledWith({
              voter: user._id,
              vote_type: newVoteType,
              vote_reason: '',
            });
            expect(post.save).toHaveBeenCalled();
          }
        }
      }

      // No Existing vote --> Simply Create a new vote
      if(!existingVoteType){
        // UnAuthorized to create a new vote
        if (insufficientRep){
          expect(res.status).toHaveBeenCalledWith(401);
          expect(post.votes).toHaveLength(0); 
        } else {
          expect(res.json).toHaveBeenCalledWith(post);
          expect(Vote.create).toHaveBeenCalledWith({
            voter: user._id,
            vote_type: newVoteType,
            vote_reason: '',
          });
          expect(post.votes).toHaveLength(1);
          expect(post.save).toHaveBeenCalled();
        }
      }
      
      // Reputation Check
      if (
        Post !== Comment &&                               // no rep changes to Commment votes
        (!insufficientRep || existingVote===newVoteType)  // Rep change when sufficient rep or when we revert the same existing vote
      ){ 
        let revertVoterRepChange = 0;
        let revertPostOwnerRepChange = 0;
        let voterRepChange = 0;
        let postOwnerRepChange = 0;

        if (existingVoteType){
          // Always revert points if existing vote 
          revertVoterRepChange = -votingActionInfo[existingVoteType].voterRepChange
          revertPostOwnerRepChange = -votingActionInfo[existingVoteType].postOwnerRepChange
        }
        
        if (!existingVoteType || existingVoteType!=newVoteType){
          // Adding new rep change if there's no existing vote
          // or the existingVote conflicting with newVoteType (such as upvote to downvote and vice versa)
          voterRepChange = votingActionInfo[newVoteType].voterRepChange
          postOwnerRepChange = votingActionInfo[newVoteType].postOwnerRepChange
        }

        const expectedVoterRep = votingActionInfo[newVoteType].reputation-insufficientRep + revertVoterRepChange + voterRepChange
        const expectedPostOwnerRep = DEFAULT_REPS+ revertPostOwnerRepChange + postOwnerRepChange
        
        expect(user.reputation).toBe(expectedVoterRep);
        expect(postOwner.reputation).toBe(expectedPostOwnerRep)
      }

      // Clean up for each type of posts
      user.reputation = votingActionInfo[newVoteType].reputation - insufficientRep
      postOwner.reputation = DEFAULT_REPS
      post.votes = []; 
    }
  }
  
  test('should create a new upvote', async () => {
    await testCreateVote('upvote');
  })

  test('should create a new downvote', async () => {
    await testCreateVote('downvote');
  });

  test('should create a new flag', async () => { 
    await testCreateVote('flag');
  })

  test('should create a new close vote', async () => { 
    await testCreateVote('close');
  })

  test('should create a new reopen vote', async () => { 
    await testCreateVote('reopen');
  })

  test('should not allow upvoting if user has insufficient reputation', async () => { 
    await testCreateVote('upvote', null, true);
  })

  test('should not allow downvoting if user has insufficient reputation', async () => { 
    await testCreateVote('downvote', null, true);
  })

  test('should not allow flagging if user has insufficient reputation', async () => { 
    await testCreateVote('flag', null, true);
  })

  test('should not allow closing if user has insufficient reputation', async () => { 
    await testCreateVote('close', null, true);
  })

  test('should not allow reopening if user has insufficient reputation', async () => { 
    await testCreateVote('reopen', null, true);
  })

  test('should revoke an existing upvote', async () => { 
    await testCreateVote('upvote', 'upvote');
  })

  test('should revoke an existing downvote', async () => { 
    await testCreateVote('downvote', 'downvote');
  })

  test('should revoke an existing flag', async () => { 
    await testCreateVote('flag', 'flag');
  })

  test('should revoke an existing close vote', async () => { 
    await testCreateVote('close', 'close');
  })

  test('should revoke an existing reopen vote', async () => { 
    await testCreateVote('reopen', 'reopen');
  })

  test('should revoke an existing upvote even if user has insufficient reputation', async () => { 
    await testCreateVote('upvote', 'upvote', true);
  })

  test('should revoke an existing downvote even if user has insufficient reputation', async () => { 
    await testCreateVote('downvote', 'downvote', true);
  })

  test('should revoke an existing flag even if user has insufficient reputation', async () => { 
    await testCreateVote('flag', 'flag', true);
  })

  test('should revoke an existing close vote even if user has insufficient reputation', async () => { 
    await testCreateVote('close', 'close', true);
  })

  test('should revoke an existing reopen vote even if user has insufficient reputation', async () => { 
    await testCreateVote('reopen', 'reopen', true);
  })

  test('should switch from upvote to downvote', async () => {
    await testCreateVote('downvote', 'upvote');
  })

  test('should switch from downvote to upvote', async () => {
    await testCreateVote('upvote', 'downvote');
  })

  test('should not allow switching from upvote to downvote if user has insufficient reputation', async () => {
    await testCreateVote('downvote', 'upvote', true);
  })

  test('should not allow switch from downvote to upvote if user has insufficient reputation', async () => {
    await testCreateVote('upvote', 'downvote', true);
  })

  test('should delete a question due to exceeding flag limit', async () => {
    const flagVotes = Array(MAX_FLAGS-1).fill().map(() => ({
        _id: new mongoose.Types.ObjectId(),
        vote_type: 'flag',
        voter: new mongoose.Types.ObjectId(),
    }));
    post.votes = [...flagVotes];
    req.body = { id: post._id, vote_type: 'flag' };
    user.reputation = votingActionInfo['flag'].reputation
    User.findById = jest.fn().mockResolvedValue(user);
    Vote.create = jest.fn().mockResolvedValue({ 
      _id: new mongoose.Types.ObjectId(),
      vote_type: 'flag',
      voter: new mongoose.Types.ObjectId(),
    });

    let Posts = [Question, Answer, Comment]
    for (let Post of Posts) {
      Post.deleteOne = jest.fn().mockResolvedValue();
      Post.findById = jest.fn().mockImplementation(
        () => ({ 
          populate: jest.fn().mockImplementation(
            () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
          )
        })
      );
      
      await addVote(req, res, Post);
      
      expect(Vote.create).toHaveBeenCalledWith({
        voter: user._id,
        vote_type: 'flag',
        vote_reason: '',
      });
      expect(post.votes).toHaveLength(MAX_FLAGS);
      expect(Post.deleteOne).toHaveBeenCalledWith({ _id: post._id });
      expect(postOwner.reputation).toBe(Math.max(1, DEFAULT_REPS+votingActionInfo['flagExceeded'].postOwnerRepChange));
      
      // Clean up
      postOwner.reputation = DEFAULT_REPS;
      post.votes = [...flagVotes];
    }
  })

  test('should close a post due to exceeding close votes', async () => {
    req.body = { id: post._id, vote_type: 'close' };

    const closeVotes = Array(MAX_CLOSE_REOPEN-1).fill().map(() => ({
      _id: new mongoose.Types.ObjectId(),
      vote_type: 'close',
      voter: new mongoose.Types.ObjectId(),
    }));
    post.votes = [...closeVotes];
    post.status = 'open';

    user.reputation = votingActionInfo['close'].reputation
    User.findById = jest.fn().mockResolvedValue(user);

    Vote.create = jest.fn().mockResolvedValue({ 
      _id: new mongoose.Types.ObjectId(),
      vote_type: 'close',
      voter: new mongoose.Types.ObjectId(),
    });
    Question.findById = jest.fn().mockImplementation(
      () => ({ 
        populate: jest.fn().mockImplementation(
          () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
        )
      })
    );
      
    await addVote(req, res, Question);
      
    expect(Vote.create).toHaveBeenCalledWith({
      voter: user._id,
      vote_type: 'close',
      vote_reason: '',
    });

    expect(post.status).toBe('closed');
    expect(post.save).toHaveBeenCalled();
  })

  test('should reopen a post due to exceeding reopen votes', async () => {
    req.body = { id: post._id, vote_type: 'reopen' };

    const reopenVotes = Array(MAX_CLOSE_REOPEN-1).fill().map(() => ({
      _id: new mongoose.Types.ObjectId(),
      vote_type: 'reopen',
      voter: new mongoose.Types.ObjectId(),
    }));
    post.votes = [...reopenVotes];
    post.status = 'closed';

    user.reputation = votingActionInfo['reopen'].reputation
    User.findById = jest.fn().mockResolvedValue(user);

    Vote.create = jest.fn().mockResolvedValue({ 
      _id: new mongoose.Types.ObjectId(),
      vote_type: 'reopen',
      voter: new mongoose.Types.ObjectId(),
    });
    Question.findById = jest.fn().mockImplementation(
      () => ({ 
        populate: jest.fn().mockImplementation(
          () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
        )
      })
    );
      
    await addVote(req, res, Question);
      
    expect(Vote.create).toHaveBeenCalledWith({
      voter: user._id,
      vote_type: 'reopen',
      vote_reason: '',
    });

    expect(post.status).toBe('open');
    expect(post.save).toHaveBeenCalled();
  })

  test('should handle errors', async () => {
    req.body = { id: post._id, vote_type: 'upvote' };
    User.findById = jest.fn().mockRejectedValue(new Error('Database error'));
    await addVote(req, res, Question);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });
});

describe("GET /isAuthorizedToVote/:voteType", () => {
    beforeEach(() => {
      server = require("../../server");
      session = require('supertest-session');
      timekeeper.freeze(new Date());
    })

    afterEach(async () => {
      server.close();
      await mongoose.disconnect()
      timekeeper.reset();
    });

    const setupSession = async(userRep=1, errorFindById = null) => {
      // Set up for login
      const mockReqBody = {
        email: 'test@example.com',
        password: 'test password',
      };

      bcrypt.hash.mockResolvedValue("hashedPassword");
      bcrypt.compare.mockResolvedValue(true);
      const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);
      const mockUser = {
        _id: '0000ffff',
        reputation: userRep,
        first_name: 'Test First Name',
        last_name: 'Test Last Name',
        email: mockReqBody.email,
        password: hashedPassword,
        display_name: 'test display name',
        date_joined: new Date(),
        time_last_seen: new Date(),
      };

      User.findOne.mockResolvedValueOnce(mockUser);

      if (errorFindById) User.findById.mockRejectedValue(errorFindById);
      else User.findById.mockResolvedValueOnce(mockUser);

      // login to get an authorized session
      let authSession = session(server)
      await authSession.post('/user/login').send(mockReqBody)
      return authSession;
    }

    it("should return 200 if user is authorized to vote", async () => {
      const voteTypes = ['upvote', 'downvote', 'flag', 'close', 'reopen']
      for (let voteType of voteTypes) {
        const authSession = await setupSession(votingActionInfo[voteType].reputation);
        // User.findById.mockResolvedValue(user);
        const response = await authSession.get(`/vote/isAuthorizedToVote/${voteType}`)
        expect(response.status).toBe(200);
      }
    })

    it("should return 200 if user is unauthorized to vote", async () => {
      const voteTypes = ['upvote', 'downvote', 'flag', 'close', 'reopen']
      for (let voteType of voteTypes) {
        const authSession = await setupSession(votingActionInfo[voteType].reputation-1);
        // User.findById.mockResolvedValue(user);
        const response = await authSession.get(`/vote/isAuthorizedToVote/${voteType}`)
        expect(response.status).toBe(401);
      }
    })

    it("should return 500 if an error occurs", async () => {
      // User.findById.mockRejectedValue(new Error("Database error"))
      const authSession = await setupSession(1, new Error("Database error"));
      const response = await authSession.get('/vote/isAuthorizedToVote/upvote')
      expect(response.status).toBe(500);
      expect(response.body).toEqual({error: "Database error"});
    });
});

describe("POST /addVoteToQuestion", () => {
  let postOwner, post;

  beforeEach(() => {
    server = require("../../server");
    session = require('supertest-session');
    timekeeper.freeze(new Date());
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
    timekeeper.reset();
  });

  test("should hit addVoteToQuestion endpoint", async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 200,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: 'test@example.com',
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
      save: jest.fn()
    };

    User.findOne.mockResolvedValueOnce(mockUser);
    User.findById.mockResolvedValueOnce(mockUser);
    // login to get an authorized session
    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody);
    expect(loginRes.status).toBe(200);

    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS,
      save: jest.fn(),
    };
    post = {
      _id: new mongoose.Types.ObjectId(),
      postOwner: postOwner,
      votes: [],
      save: jest.fn(),
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);
    Vote.create = jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
    Vote.deleteOne = jest.fn().mockResolvedValue();

    Question.findById = jest.fn().mockImplementation(
      () => ({
        populate: jest.fn().mockImplementation(
          () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
        )
      })
    );

    const response = await authSession.post('/vote/addVoteToQuestion')
      .send({ id: post._id, vote_type: "upvote"});
    expect(response.status).toBe(200);
  });
});

describe("POST /addVoteToAnswer", () => {
  let postOwner, post;

  beforeEach(() => {
    server = require("../../server");
    session = require('supertest-session');
    timekeeper.freeze(new Date());
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
    timekeeper.reset();
  });

  test("should hit addVoteToQuestion endpoint", async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 200,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: 'test@example.com',
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
      save: jest.fn()
    };

    User.findOne.mockResolvedValueOnce(mockUser);
    User.findById.mockResolvedValueOnce(mockUser);
    // login to get an authorized session
    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody);
    expect(loginRes.status).toBe(200);

    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS,
      save: jest.fn(),
    };
    post = {
      _id: new mongoose.Types.ObjectId(),
      postOwner: postOwner,
      votes: [],
      save: jest.fn(),
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);
    Vote.create = jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
    Vote.deleteOne = jest.fn().mockResolvedValue();

    Answer.findById = jest.fn().mockImplementation(
      () => ({
        populate: jest.fn().mockImplementation(
          () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
        )
      })
    );

    const response = await authSession.post('/vote/addVoteToAnswer')
      .send({ id: post._id, vote_type: "upvote"});
    expect(response.status).toBe(200);
  });
});

describe("POST /addVoteToComment", () => {
  let postOwner, post;

  beforeEach(() => {
    server = require("../../server");
    session = require('supertest-session');
    timekeeper.freeze(new Date());
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
    timekeeper.reset();
  });

  test("should hit addVoteToQuestion endpoint", async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 200,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: 'test@example.com',
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
      save: jest.fn()
    };

    User.findOne.mockResolvedValueOnce(mockUser);
    User.findById.mockResolvedValueOnce(mockUser);
    // login to get an authorized session
    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody);
    expect(loginRes.status).toBe(200);

    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS,
      save: jest.fn(),
    };
    post = {
      _id: new mongoose.Types.ObjectId(),
      postOwner: postOwner,
      votes: [],
      save: jest.fn(),
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);
    Vote.create = jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
    Vote.deleteOne = jest.fn().mockResolvedValue();

    Comment.findById = jest.fn().mockImplementation(
      () => ({
        populate: jest.fn().mockImplementation(
          () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
        )
      })
    );

    const response = await authSession.post('/vote/addVoteToComment')
      .send({ id: post._id, vote_type: "upvote", vote_reason: "Test"});
    expect(response.status).toBe(200);
  });
});

describe("Handle Reputation Error", () => {
  let postOwner, post;

  beforeEach(() => {
    server = require("../../server");
    session = require('supertest-session');
    timekeeper.freeze(new Date());
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
    timekeeper.reset();
  });

  test("if invalid action given, throws corresponding error", async () => {
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 200,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: 'test@example.com',
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
      save: jest.fn()
    };

    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS,
      save: jest.fn(),
    };

    const errRes = handleVoteReputation(mockUser, postOwner, 'upvote', "FAIL");
    expect(errRes).rejects.toThrow("Invalid action type: FAIL. Valid action types are: apply, revert");
  });

  test("if invalid vote type given, throws corresponding error", async () => {

    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 200,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: 'test@example.com',
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
      save: jest.fn()
    };

    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS,
      save: jest.fn(),
    };

    const errRes = handleVoteReputation(mockUser, postOwner, 'FAIL', "apply");
    expect(errRes).rejects.toThrow("Invalid vote type");
  });

  test("if not enough reputation to apply vote, throws corresponding error", async () => {

    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: 'test@example.com',
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
      save: jest.fn()
    };

    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS,
      save: jest.fn(),
    };

    const errRes = handleVoteReputation(mockUser, postOwner, 'upvote', "apply");
    expect(errRes).rejects.toThrow("Needs at least 15 reputation to upvote");
  });

  test("if save fails, throws corresponding error", async () => {

    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 200,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: 'test@example.com',
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
      save: jest.fn().mockRejectedValue(new Error("FAIL"))
    };

    postOwner = {
      _id: new mongoose.Types.ObjectId(),
      reputation: DEFAULT_REPS,
      save: jest.fn(),
    };

    const errRes = handleVoteReputation(mockUser, postOwner, 'upvote', "apply");
    expect(errRes).rejects.toThrow("Error when handling vote reputation: FAIL");
  });
});
