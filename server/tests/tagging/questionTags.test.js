// unit tests for addTag in question utils
const supertest = require("supertest")
const {default: mongoose} = require("mongoose");

const Question = require('../../models/questions');
const User = require('../../models/users');
const {addTag } = require('../../utils/question');
const mockingoose = require("mockingoose");
const Tag = require("../../models/tags");

// Mocking the models
jest.mock("../../models/questions");
jest.mock("bcrypt");


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

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ans_by: user1,

}

describe('Question Utils', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  // addTag
  test('addTag return tag id if the tag already exists', async () => {
    mockingoose(Tag).toReturn(tag1, 'findOne');

    const result = await addTag('react', 1500);
    expect(result.toString()).toEqual(tag1._id);
  });

  test('addTag return tag id of new tag if does not exist in database', async () => {
    mockingoose(Tag).toReturn(null, 'findOne');
    mockingoose(Tag).toReturn(tag2, 'save');

    const result = await addTag('javascript', 1500);
    expect(result.toString()).toEqual(tag2._id);
  });
})