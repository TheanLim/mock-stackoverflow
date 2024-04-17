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
    res.status(500).json({error: "Failed to find questions."});
  }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
  try {
    let incrementView = req.query.incrementView !== 'false'; 
    const question = await Question.findOneAndUpdate(
      {_id: req.params.qid},
      incrementView ? { $inc: { views: 1 } } : {}, 
      { new: true }
      )
      .populate({
        path: 'tags',
        model: 'Tag'
      })
      .populate({
        path: 'answers',
        model: 'Answer',
        populate: [
          { path: 'votes', model: 'Vote'},
          { path: 'ans_by', model: 'User'},
          { path: 'comments', model: 'Comment', populate: [
            { path: 'comment_by', model: 'User'},
            { path: 'votes', model: 'Vote'}
          ]},
        ]
      })
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: [
          { path: 'comment_by', model: 'User'},
          { path: 'votes', model: 'Vote'}
        ],
      })
      .populate('solution')
      .populate('asked_by')
      .populate('votes')

    res.json(question.toJSON({virtuals:true}));
  } catch (err) {
    res.status(500).json({error: "Failed to find questions."});
  }
};

// To add Question
const addQuestion = async (req, res) => {
  try {
    let requestBody = req.body;
    requestBody.asked_by = await User.findById(req.session.user);
    requestBody.tags = await Promise.all(requestBody.tags.map(tname => addTag(tname)));

    const createdQuestion = await Question.create(requestBody);
    res.json(createdQuestion);
  } catch (err) {
    res.status(500).json({});
  }
};

router.get("/getQuestion", getQuestionsByFilter);
router.get("/getQuestionById/:qid", getQuestionById);
router.post("/addQuestion", addQuestion);

module.exports = router;