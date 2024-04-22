// Unit tests for controller/vote.js
const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const timekeeper = require('timekeeper');
const bcrypt = require("bcrypt");

const User = require("../../models/users");
const Question = require("../../models/questions");
const Answer = require("../../models/answers");
const Comment = require("../../models/comments");
const { votingActionInfo, handleVoteReputation} =  require("../../utils/reputation");
const { addComment } = require("../../utils/comment");

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

describe("GET /isAuthorizedToComment", () => {
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
      const authSession = await setupSession(votingActionInfo['comment'].reputation);
      const response = await authSession.get(`/comment/isAuthorizedToComment`)
      expect(response.status).toBe(200);
    })

    it("should return 401 if user is unauthorized to vote", async () => {
      const authSession = await setupSession(votingActionInfo['comment'].reputation-1);
      const response = await authSession.get(`/comment/isAuthorizedToComment`)
      expect(response.status).toBe(401);
    })

    it("should return 500 if an error occurs", async () => {
      const authSession = await setupSession(1, new Error("Database error"));
      const response = await authSession.get('/comment/isAuthorizedToComment')
      expect(response.status).toBe(500);
      expect(response.body).toEqual({error: "Database error"});
    });
});

describe("addComment Helper function", () =>{
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
      comments: [],
      save: jest.fn(),
    };
    timekeeper.freeze(new Date());
  });

  afterEach(() => {
    jest.clearAllMocks();
    timekeeper.reset();
  });

  const testCreateComment = async(insufficientRep = false) => {
    user.reputation = votingActionInfo['comment'].reputation - insufficientRep
    req.body = { id: post._id, text: 'comment text'};

    User.findById = jest.fn().mockResolvedValue(user);
    Comment.create = jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() });

    const Posts = [Question, Answer]
    for (let Post of Posts) {
      Post.findById = jest.fn().mockImplementation(
        () => ({ 
          populate: jest.fn().mockImplementation(
            () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
          )
        })
      );

      await addComment(req, res, Post);

      expect(User.findById).toHaveBeenCalledWith(req.session.user);
      expect(Post.findById).toHaveBeenCalledWith(post._id);

      if (!insufficientRep) {
        expect(Comment.create).toHaveBeenCalledWith({
          comment_by: user,
          text: req.body.text,
          comment_date_time: new Date(),
        });
        expect(post.comments).toHaveLength(1);
        expect(post.save).toHaveBeenCalled();
      } else {
        expect(res.status).toHaveBeenCalledWith(401);
        expect(post.comments).toHaveLength(0);
      }

      // clean up 
      user.reputation = votingActionInfo['comment'].reputation - insufficientRep
      postOwner.reputation = DEFAULT_REPS
      post.comments = []; 
    }
  }

  test('should add a new comment', async () => {
    await testCreateComment();
  })

  test('should not allow commenting if the user has insufficient reputation', async () => {
    await testCreateComment(true);
  })

  test('should handle errors', async () => {
    req.body = { id: post._id, text: 'comment text'};
    User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

    const Posts = [Question, Answer]
    for (let Post of Posts) {
      await addComment(req, res, Post);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    }
  });
  
});

describe("Comment add endpoints hit addComment helper", () =>{
  let req, res, user, postOwner, post;

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

  test('addComment to Question hits endpoint and returns correct info', async () => {
    const authSession = await setupSession(votingActionInfo['comment'].reputation);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: votingActionInfo['comment'].reputation,
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
    post = {
      _id: new mongoose.Types.ObjectId(),
      postOwner: postOwner,
      comments: [],
      save: jest.fn(),
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);
    Comment.create = jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() });

    Question.findById = jest.fn().mockImplementation(
      () => ({
        populate: jest.fn().mockImplementation(
          () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
        )
      })
    );

    const response = await authSession.post("/comment/addCommentToQuestion")
      .send({ id: post._id, text: "Sample Text"});
    expect(response.status).toBe(200);

    expect(User.findById).toHaveBeenCalledWith('0000ffff');
    expect(Question.findById).toHaveBeenCalledWith(post._id.toString());

    expect(Comment.create).toHaveBeenCalledWith({
      comment_by: mockUser,
      text: "Sample Text",
      comment_date_time: new Date(),
    });
    expect(post.comments).toHaveLength(1);
    expect(post.save).toHaveBeenCalled();

  })

  test('addComment to Answer hits endpoint and returns correct info', async () => {
    const authSession = await setupSession(votingActionInfo['comment'].reputation);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash("test password", SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: votingActionInfo['comment'].reputation,
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
    post = {
      _id: new mongoose.Types.ObjectId(),
      postOwner: postOwner,
      comments: [],
      save: jest.fn(),
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);
    Comment.create = jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() });

    Answer.findById = jest.fn().mockImplementation(
      () => ({
        populate: jest.fn().mockImplementation(
          () => ({ populate: jest.fn().mockResolvedValueOnce(post)})
        )
      })
    );

    const response = await authSession.post("/comment/addCommentToAnswer")
      .send({ id: post._id, text: "Sample Text"});
    expect(response.status).toBe(200);

    expect(User.findById).toHaveBeenCalledWith('0000ffff');
    expect(Answer.findById).toHaveBeenCalledWith(post._id.toString());

    expect(Comment.create).toHaveBeenCalledWith({
      comment_by: mockUser,
      text: "Sample Text",
      comment_date_time: new Date(),
    });
    expect(post.comments).toHaveLength(1);
    expect(post.save).toHaveBeenCalled();

  })

});