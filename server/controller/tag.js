const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
  try {
    let tags = await Tag.find();
    let questions = await Question.find().populate('tags');
    let qTags = questions.map(q => q.tags.map(tag => Tag(tag).name));
    let tagReturn = [];
    for (let i = 0; i < tags.length; i++) {
        let tag = Tag(tags[i]);
        let tagCount = qTags.filter(qt => qt.includes(tag.name)).length;
        tagReturn.push({
            name: tag.name,
            qcnt: tagCount,
        });
    }
    res.json(tagReturn);
  } catch (err) {
    res.status(500).json({error: "Unable to get tags and question numbers"});
  }
};

router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber)

// add appropriate HTTP verbs and their endpoints to the router.

module.exports = router;
