const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
  try {
    let answerBody = req.body.ans;
    let qid = req.body.qid;
    const newAnswer = await Answer.create(answerBody);
    await Question.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [newAnswer._id], $position: 0 } } },
      { new: true }
    );
    res.json(newAnswer);
  } catch (err) {
    res.status(500).json({});
    //res.send("Failed to create answer");
  }
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addAnswer', addAnswer);


module.exports = router;
