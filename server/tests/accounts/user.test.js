// Unit tests for controller/user.js
const supertest = require("supertest")
const User = require('../../models/users');
const {default: mongoose} = require("mongoose");
const timekeeper = require('timekeeper');
const bcrypt = require("bcrypt");
const {auth} = require("mysql/lib/protocol/Auth");

// Mock the Answer model
jest.mock("../../models/users");
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
})

afterEach(async () => {
  server.close();
  await mongoose.disconnect()
  timekeeper.reset();
});

describe("POST /login", () => {

  it('should send a 200 OK response when the user email and password is valid', async () => {
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

    User.findOne.mockResolvedValueOnce(mockUser);

    // Making the request
    const response = await supertest(server)
      .post("/user/login")
      .send(mockReqBody)
    expect(response.status).toBe(200);
    expect(User.findOne).toHaveBeenCalledWith({email: mockReqBody.email});
    expect(bcrypt.compare).toHaveBeenCalledWith(mockReqBody.password, hashedPassword);
    expect(response.body).toEqual({user: "0000ffff"});
  })

  it('should send a 400 Bad Request response when email or password is not provided', async () => {
    // Missing password
    const mockReqBody = {
      email: 'test@example.com',
    };

    // Making the request
    const response = await supertest(server)
      .post("/user/login")
      .send(mockReqBody)

    expect(response.status).toBe(400);
  })

  it('should send a 401 Unauthorized response when the user email not found', async () => {
    const mockReqBody = {
      email: 'emailNotFound@example.com',
      password: 'test password',
    };

    // Simulate user not found
    User.findOne.mockResolvedValueOnce(null);
    // Making the request
    const response = await supertest(server)
      .post("/user/login")
      .send(mockReqBody)

    expect(response.status).toBe(401);
    expect(User.findOne).toHaveBeenCalledWith({email: mockReqBody.email});
  })

  it('should send a 401 Unauthorized response when incorrect password', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };

    User.findOne.mockResolvedValueOnce({password: 'incorrect password'});
    bcrypt.compare.mockResolvedValue(false);
    // Making the request
    const response = await supertest(server)
      .post("/user/login")
      .send(mockReqBody)

    expect(response.status).toBe(401);

  })

  it('should send a 500 server response when error occurs', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };

    User.findOne.mockRejectedValueOnce(new Error("Fail"));
    bcrypt.compare.mockResolvedValue(false);
    // Making the request
    const response = await supertest(server)
      .post("/user/login")
      .send(mockReqBody)

    expect(response.status).toBe(500);
    expect(response.body).toEqual({error: "Failed to login."})
  })
});

describe("POST /signUp", () => {
  const mockReqBody = {
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: 'test@example.com',
    password: 'test password',
    display_name: 'test display name',
  };

  it('should send a 200 OK response and when sign up successfully', async () => {

    bcrypt.hash.mockResolvedValue('hashedPassword');
    const hashedPassword = await bcrypt.hash(mockReqBody.password, SALT_ROUNDS);

    const mockUserCreateArgs = {
      reputation: 1,
      ...mockReqBody,
      password: hashedPassword,
      date_joined: new Date(),
      time_last_seen: new Date(),
    };

    const mockUser = {
      _id: '0000ffff',
      password: hashedPassword,
      ...mockUserCreateArgs
    }
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce(mockUser);

    // Making the request
    const response = await supertest(server)
      .post("/user/signUp")
      .send(mockReqBody)

    expect(response.status).toBe(200);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockReqBody.password, SALT_ROUNDS);
    expect(User.create).toHaveBeenCalledWith(mockUserCreateArgs);
    expect(response.body).toEqual({user: "0000ffff"});
  });

  it('should send a 403 response when email (unique) already exists', async () => {
    User.findOne.mockResolvedValueOnce({
      _id: '0000ffff',
      reputation: 1,
      ...mockReqBody,
      date_joined: new Date(),
      time_last_seen: new Date(),
    });

    // Making the request
    const response = await supertest(server)
      .post("/user/signUp")
      .send(mockReqBody)

    expect(response.status).toBe(403);
    expect(response.body).toEqual({error: 'Email already exists'});
  });

  it('should send a 403 response when display name (unique) already exists', async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.findOne.mockResolvedValueOnce({
      _id: '0000ffff',
      reputation: 1,
      ...mockReqBody,
      date_joined: new Date(),
      time_last_seen: new Date(),
    });

    // Making the request
    const response = await supertest(server)
      .post("/user/signUp")
      .send(mockReqBody)

    expect(response.status).toBe(403);
    expect(response.body).toEqual({error: 'Display Name already exists'});
  });

  it('should send a 500 response when unable User database write fails', async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockRejectedValue(new Error('DB Error Message'));

    // Making the request
    const response = await supertest(server)
      .post("/user/signUp")
      .send(mockReqBody)

    expect(response.status).toBe(500);
  });
});

describe("POST /logout", () => {

  it('should send a 200 OK response when a user is logged in and then logs out', async () => {
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
      session: {
        user: '0000ffff'
      }
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

    User.findOne.mockResolvedValueOnce(mockUser);

    // Making the request
    let authSession = session(server);
    const logInResponse = await authSession.post('/user/login').send(mockReqBody)
    expect(logInResponse.status).toBe(200);
    expect(User.findOne).toHaveBeenCalledWith({email: mockReqBody.email});
    expect(bcrypt.compare).toHaveBeenCalledWith(mockReqBody.password, hashedPassword);
    expect(logInResponse.body).toEqual({user: "0000ffff"});

    const response = await authSession.get("/user/logout");
    expect(response.status).toBe(200);
  })

  it('execute logout when no session exists', async () => {

    let authSession = session(server);

    const response = await authSession.get("/user/logout");
    expect(response.status).toBe(200);
  })
});

describe("GET /validateAuth", () => {
  it('should send a 401 Unauthorized response if user is not logged in', async () => {
    // Making the request
    const response = await supertest(server).get('/user/validateAuth');
    // Asserting the response
    expect(response.status).toBe(401);
  })

  it('should return user if logged in previously (request session is set)', async () => {
    // Set up for login
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };

    const userId = '0000ffff';
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

    User.findOne.mockResolvedValueOnce(mockUser);
    // login to get an authorized session
    let authSession = session(server)
    await authSession.post('/user/login').send(mockReqBody)

    // Validate session
    const response = await authSession.get('/user/validateAuth');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({user: userId});
  })
})

describe("GET /csrf-token", () => {
  it('should return user if logged in previously (request session is set)', async () => {
    // Set up for login
    const mockReqBody = {
      email: 'test@example.com',
      password: 'test password',
    };

    const userId = '0000ffff';
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

    User.findOne.mockResolvedValueOnce(mockUser);
    // login to get an authorized session
    let authSession = session(server)
    await authSession.post('/user/login').send(mockReqBody)

    // Validate session
    const response = await authSession.get('/user/csrf-token');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({csrfToken: 'mockCSRFToken123'});
  })
})
