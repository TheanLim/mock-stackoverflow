const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Question = require("../../models/questions");
// Mock the Answer model
jest.mock("../../models/answers");

let server;

describe("POST /markAnswerAsSolution", () => {

  beforeEach(() => {
    server = require("../../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it("should mark an answer as solution", async () => {
    const qid = new mongoose.Types.ObjectId().toHexString();
    const aid = new mongoose.Types.ObjectId().toHexString();
    const mockReqBody = {qid:qid, aid:aid}

    Question.findById = jest.fn().mockReturnValue({solution: null});
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      solution: aid,
    });

    const res = await supertest(server)
      .post("/answer/markAnswerAsSolution")
      .send(mockReqBody);

    expect(res.status).toBe(200)
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: qid },
      { $set: { solution: aid } },
      { new: true }
    );
  });

  it("should unmark an answer as solution", async () => {
    const qid = new mongoose.Types.ObjectId().toHexString();
    const aid = new mongoose.Types.ObjectId().toHexString();
    const mockReqBody = {qid:qid, aid:aid}

    Question.findById = jest.fn().mockReturnValue({solution: new mongoose.Types.ObjectId(aid)});
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      solution: aid,
    });

    const res = await supertest(server)
      .post("/answer/markAnswerAsSolution")
      .send(mockReqBody);

    expect(res.status).toBe(200)
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: qid },
      { $unset: { solution: "" } },
      { new: true }
    );
  });

  it("should handle errors", async () => {
    const qid = new mongoose.Types.ObjectId();
    const aid = new mongoose.Types.ObjectId().toHexString();
    const mockReqBody = {qid:qid, aid:aid}

    // Mock db error
    Question.findById = jest.fn().mockRejectedValueOnce(new Error());
    const res = await supertest(server)
      .post("/answer/markAnswerAsSolution")
      .send(mockReqBody);

    expect(res.status).toBe(500)
  });
});