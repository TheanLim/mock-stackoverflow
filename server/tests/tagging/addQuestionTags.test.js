// unit tests for tagging functions in controller/question.js
const supertest = require("supertest")
const {default: mongoose} = require("mongoose");

const Question = require('../../models/questions');
const User = require('../../models/users');
const {addTag } = require('../../utils/question');

// Mocking the models
jest.mock("../../models/questions");
jest.mock("bcrypt");
jest.mock('../../utils/question', () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));

let server;

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'react'
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'javascript'
};

const user1 = {
  _id: '65e9b58910afe6e94dsfjkhc',
  display_name: 'marko',
  reputation: 100
}

const user2 = {
  _id: '65e9b58910adsfsdhfc6e6dc',
  display_name: 'thean',
  reputation: 2000
}

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ans_by: user2,

}

describe('POST /addQuestion', () => {

  beforeEach(() => {
    server = require("../../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('should add a new question with tag', async () => {
    // Mock request body

    const mockTags = tag1;

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1],
      answers: [ans1],
    }

    User.findOne = jest.fn().mockImplementation(() => jest.fn().mockResolvedValueOnce(user2));
    addTag.mockResolvedValue(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);

  });

  it('should throw an error if user lacks reputation to make new tags', async () => {
    // Mock request body

    const mockTags = null;

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    User.findOne = jest.fn().mockImplementation(() => jest.fn().mockResolvedValueOnce(user1));
    addTag.mockResolvedValue(mockTags);

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(403);
    expect(response.body).toEqual({error: "Not enough reputation to create new tags."});

  });
});
