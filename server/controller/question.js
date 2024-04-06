const express = require("express");
const Question = require("../models/questions");
const User = require("../models/users");
const {addTag, getQuestionsByOrder, filterQuestionsBySearch} = require('../utils/question');

const router = express.Router();

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
  try {
    let questions_list = await getQuestionsByOrder(req.query.order);
    questions_list = filterQuestionsBySearch(questions_list, req.query.search);
    res.send(questions_list);
  } catch (err) {
    res.status(500).json({err: err.message});
    //res.send("Error finding questions");
  }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOneAndUpdate(
      {_id: req.params.qid},
      { $inc: { views: 1 } }, { new: true })
      .populate({
        path : 'answers',
        populate : {
          path : 'ans_by',
          select: 'display_name'
        }
      })
      .populate({
        path : 'comments',
        populate : {
          path : 'comment_by',
          select: 'display_name'
        }
      })
      .populate({
        path : 'votes',
        populate : {
          path : 'voter',
          select: 'display_name'
        }
      })
      .populate('asked_by', 'display_name')
      .populate('tags solution');
    res.json(question);
  } catch (err) {
    res.status(500).json({err: err});
    //res.send("Unable to find Question.");
  }
};

// To add Question
const addQuestion = async (req, res) => {
  try {
    let requestBody = req.body;

    // TODO: IMPLEMENT USER DB OBJECT ACCESS FOR QUESTIONS
    const postOwner = await User.findById('660dcc9f87c1cfd5775ffc04');
    requestBody.asked_by = postOwner;

    requestBody.tags = await Promise.all(requestBody.tags.map(tname => addTag(tname)));

    const createdQuestion = await Question.create(requestBody);
    res.json(createdQuestion);
  } catch (err) {
    res.status(500).json({});
    //res.send("Unable to add Question.");
  }
};


router.get("/getQuestion", getQuestionsByFilter);
router.get("/getQuestionById/:qid", getQuestionById);
router.post("/addQuestion", addQuestion);

// add appropriate HTTP verbs and their endpoints to the router

module.exports = router;
