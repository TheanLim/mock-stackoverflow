const express = require("express");
const { Types } = require('mongoose');
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
  try {
    let answerBody = req.body.ans;

    answerBody.ans_by = await User.findById(req.session.user);
    let qid = req.body.qid;
    const newAnswer = await Answer.create(answerBody);
    await Question.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [newAnswer._id], $position: 0 } } },
      { new: true }
    );
    res.json(newAnswer);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

const markAnswerAsSolution = async (req, res) => {
  try {
    const qid = req.body.qid;
    const aid = req.body.aid;
    const aidObjectId = new Types.ObjectId(aid);

    // Check if solution is already set
    let updatedQuestion;
    const existingQuestion = await Question.findById(qid);
    if (existingQuestion.solution && existingQuestion.solution.equals(aidObjectId)) {
      // If solution was set
      updatedQuestion = await Question.findOneAndUpdate(
        { _id: qid },
        { $unset: { solution: "" } },
        { new: true }
      );
    } else {
      // If solution was not set
      updatedQuestion = await Question.findOneAndUpdate(
        { _id: qid },
        { $set: { solution: aid } },
        { new: true }
      );
    }
    res.json(updatedQuestion)
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

router.post('/addAnswer', addAnswer);
router.post('/markAnswerAsSolution', markAnswerAsSolution);

module.exports = router;