// Unit tests for controller/profile.js
const supertest = require("supertest")
const User = require('../../models/users');
const Question = require('../../models/questions')
const {default: mongoose} = require("mongoose");
const timekeeper = require('timekeeper');
const bcrypt = require("bcrypt");

// Mock the Answer model
jest.mock("../../models/users");
jest.mock("../../models/questions");
jest.mock("bcrypt");
jest.mock('csurf', () => jest.fn((options) => {
  return (req, res, next) => {
    req.csrfToken = () => 'mockCSRFToken123'; // Mock CSRF token function
    next();
  };
}));

let server;
let session;
const SALT_ROUNDS = 10;

beforeEach(() => {
  server = require("../../server");
  session = require('supertest-session');
  timekeeper.freeze(new Date());
});

afterEach(async () => {
  server.close();
  await mongoose.disconnect()
  timekeeper.reset();
});

describe("GET /view/:uid", () => {

  it('should send a 200 response and mark ownership true if viewing their own profile', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: mockReqBody.email,
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };
    const mockQList = [
      {
        title: "Test Title",
        asked_by: mockUser,
        ask_date_time: new Date(),
        answers: [
          {ans_date_time: new Date()}
        ]
      },
      {
        title: "Test Title2",
        asked_by: mockUser,
        ask_date_time: new Date(),
        answers: [
          {ans_date_time: new Date()}
        ]
      }
    ];

    const mockListRes = [
      {
        title: "Test Title",
        asked_by: {
          ...mockUser,
          date_joined: (new Date()).toISOString(),
          time_last_seen: (new Date()).toISOString()
        },
        ask_date_time: (new Date()).toISOString(),
        answers: [
          {ans_date_time: (new Date()).toISOString()}
        ]
      },
      {
        title: "Test Title2",
        asked_by: {
          ...mockUser,
          date_joined: (new Date()).toISOString(),
          time_last_seen: (new Date()).toISOString()
        },
        ask_date_time: (new Date()).toISOString(),
        answers: [
          {ans_date_time: (new Date()).toISOString()}
        ]
      }
    ];

    const mockResponse = {
      profile: {
        ...mockUser,
        date_joined: (new Date()).toISOString(),
        time_last_seen: (new Date()).toISOString()
      },
      profileOwner: true,
      questions: mockListRes,
      answers: mockListRes
    }

    User.findById.mockResolvedValueOnce(mockUser);
    Question.find = jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockResolvedValueOnce(mockQList),
      populate: jest.fn().mockResolvedValueOnce(mockQList)
    }));

    User.findOne.mockResolvedValueOnce(mockUser);

    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody)
    expect(loginRes.status).toBe(200);

    // Making the request
    const response = await authSession
      .get("/profile/view/0000ffff");
    expect(response.status).toBe(200);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(response.body).toEqual(mockResponse);
  })

  it('should send a 200 response and mark ownership false if viewing unowned profile', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);

    const mockLogin = {
      _id: '0000ffff',
      email: mockReqBody.email,
      password: hashedPassword
    };

    const mockUser = {
      _id: '0000fffA',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: mockReqBody.email,
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };
    const mockQList = [
      {
        title: "Test Title",
        asked_by: mockUser,
        ask_date_time: new Date(),
        answers: [
          {ans_date_time: new Date()}
        ]
      }
    ];

    const mockListRes = [
      {
        title: "Test Title",
        asked_by: {
          ...mockUser,
          date_joined: (new Date()).toISOString(),
          time_last_seen: (new Date()).toISOString()
        },
        ask_date_time: (new Date()).toISOString(),
        answers: [
          {ans_date_time: (new Date()).toISOString()}
        ]
      }
    ];

    const mockResponse = {
      profile: {
        ...mockUser,
        date_joined: (new Date()).toISOString(),
        time_last_seen: (new Date()).toISOString()
      },
      profileOwner: false,
      questions: mockListRes,
      answers: mockListRes
    }

    User.findById.mockResolvedValueOnce(mockUser);
    Question.find = jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockResolvedValueOnce(mockQList),
      populate: jest.fn().mockResolvedValueOnce(mockQList)
    }));

    User.findOne.mockResolvedValueOnce(mockLogin);

    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody)
    expect(loginRes.status).toBe(200);

    // Making the request
    const response = await authSession
      .get("/profile/view/0000fffA");
    expect(response.status).toBe(200);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(response.body).toEqual(mockResponse);
  })

  it('should send a 401 response if user does not exist', async () => {
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: "test@example.com",
      password: "hashedPassword",
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    User.findById.mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(server)
      .get("/profile/view/0000ffff");
    expect(response.status).toBe(401);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(response.body).toEqual({error: "Incorrect id to profile."});
  })

  it('should send a 500 response if error occurs', async () => {
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: "test@example.com",
      password: "hashedPassword",
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    User.findById.mockResolvedValueOnce(mockUser);
    Question.find = jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockResolvedValueOnce(new Error("MockFail")),
      populate: jest.fn().mockResolvedValueOnce(new Error("MockFail"))
    }));

    // Making the request
    const response = await supertest(server)
      .get("/profile/view/0000ffff");
    expect(response.status).toBe(500);
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(response.body).toEqual({error: "Failed to find user profile"});
  })
});

describe("POST /edit", () => {
  it('should send a 200 response if update went through', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: mockReqBody.email,
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    const profileChanges = {
      display_name: "test display name",
      email: mockReqBody.email,
      about_summary: "TESTED CHANGE",
      first_name: "Test First Name",
      last_name: "Test Last Name"
    }

    User.findOne.mockResolvedValueOnce(mockUser);

    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody)
    expect(loginRes.status).toBe(200);

    User.findOne.mockResolvedValue(mockUser);

    User.findByIdAndUpdate.mockResolvedValue({
      ...mockUser,
      display_name: "test display name",
      email: mockReqBody.email,
      about_summary: "TESTED CHANGE",
      first_name: "Test First Name",
      last_name: "Test Last Name"
    })


    // Making the request
    const response = await authSession
      .post("/profile/edit")
      .send(profileChanges);
    expect(response.status).toBe(200);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, profileChanges);
    expect(response.body).toEqual({user: mockUser._id});
  })

  it('should send a 403 response if new display name is taken', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: mockReqBody.email,
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    const existingUser = {
      _id: '0000fffA',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: mockReqBody.email,
      password: hashedPassword,
      display_name: 'test display name TAKEN',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    const profileChanges = {
      display_name: "test display name TAKEN",
      email: mockReqBody.email,
      about_summary: "TESTED CHANGE",
      first_name: "Test First Name",
      last_name: "Test Last Name"
    }

    User.findOne.mockResolvedValueOnce(mockUser);

    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody)
    expect(loginRes.status).toBe(200);

    User.findOne.mockResolvedValue(existingUser);

    // Making the request
    const response = await authSession
      .post("/profile/edit")
      .send(profileChanges);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({error: 'New Display Name already exists'});
  })

  it('should send a 403 response if new email is taken', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: mockReqBody.email,
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    const existingUser = {
      _id: '0000fffA',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: "new@email.com",
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    const profileChanges = {
      display_name: "test display name",
      email: "new@email.com",
      about_summary: "TESTED CHANGE",
      first_name: "Test First Name",
      last_name: "Test Last Name"
    }

    User.findOne.mockResolvedValueOnce(mockUser);

    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody)
    expect(loginRes.status).toBe(200);

    User.findOne.mockResolvedValueOnce(mockUser);
    User.findOne.mockResolvedValueOnce(existingUser);

    // Making the request
    const response = await authSession
      .post("/profile/edit")
      .send(profileChanges);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({error: 'New email already exists'});
  })

  it('should send a 500 response if error occurs', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");
    bcrypt.compare.mockResolvedValue(true);
    const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);
    const mockUser = {
      _id: '0000ffff',
      reputation: 1,
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      email: mockReqBody.email,
      password: hashedPassword,
      display_name: 'test display name',
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    const profileChanges = {
      display_name: "test display name",
      email: "new@email.com",
      about_summary: "TESTED CHANGE",
      first_name: "Test First Name",
      last_name: "Test Last Name"
    }

    User.findOne.mockResolvedValueOnce(mockUser);

    let authSession = session(server)
    let loginRes = await authSession.post('/user/login').send(mockReqBody)
    expect(loginRes.status).toBe(200);

    User.findOne.mockResolvedValue(null);

    User.findByIdAndUpdate.mockRejectedValue(new Error("Error"))

    // Making the request
    const response = await authSession
      .post("/profile/edit")
      .send(profileChanges);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({error: "Failed to update profile."});
  })
});