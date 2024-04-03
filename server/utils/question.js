const Tag = require("../models/tags");
const Question = require("../models/questions");
const Answer = require("../models/answers");

function getQuestions() {
  return Question.find()
    .populate('tags')
    .populate('answers');
}

const addTag = async (tname) => {
    let tag = await Tag.findOne({name: tname});
    if (tag) {
      return tag._id;
    } else {
      let newTag = Tag({name: tname});
      let newTagSaved = await newTag.save();
      return newTagSaved._id;
    }
};

function checkTags(q, tags) {
  for (let searchTag of tags) {
    for (let tagObj of q.tags) {
      if (Tag(tagObj).name === searchTag) {
        return true;
      }
    }
  }
  return false;
}

function checkKeywords(q, keywords) {
  for (let w of keywords) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }
  return false;
}

const getQuestionsByOrder = async (order) => {
  let questions = await getQuestions(order).exec();
  //Sort questions automatically on time asked, so this order is present within subsorts.
  questions.sort((a, b) => {
    return b.ask_date_time - a.ask_date_time;
  });
  //Sorting by active will prioritize answer dates, but retain question recency sorts within same ans dates
  if (order === "active") {
    questions.sort((qA, qB) => {
      let askTimeDiff = qB.ask_date_time - qB.ask_date_time;

      if (qA.answers.length === 0 && qB.answers.length === 0) {
        //If both have no answers, prioritize ask time
        return askTimeDiff;
      } else if (qA.answers.length === 0 || qB.answers.length === 0) {
        //If one had no answers, priorize the one with at least one answer
        return qB.answers.length - qA.answers.length;
      }
      //If both have answers, find most recent and compare times.
      let mostRecentAnswerA = qA.answers.map(ans => Answer(ans).ans_date_time)
        .sort((ansA, ansB) => ansB - ansA)[0];
      let mostRecentAnswerB = qB.answers.map(ans => Answer(ans).ans_date_time)
        .sort((ansA, ansB) => ansB - ansA)[0];
      if (mostRecentAnswerA === mostRecentAnswerB) {
        return
      }
      return mostRecentAnswerB - mostRecentAnswerA;
    });
    //console.log(questions);
  } else if (order === "unanswered") {
    questions = questions.filter(q => q.answers.length === 0);
  }
  return questions;
}

const filterQuestionsBySearch = (qlist, search) => {
  let searchTags = (search.toLowerCase()
    .match(/\[([^\]]+)\]/g) || [])
    .map((word) => word.slice(1, -1));
  let searchKeyword = search.toLowerCase()
    .replace(/\[([^\]]+)\]/g, " ")
    .match(/\b\w+\b/g) || [];

  const matchingQuestions = qlist.filter((q) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    } else if (searchKeyword.length === 0) {
      return checkTags(q, searchTags);
    } else if (searchTags.length === 0) {
      return checkKeywords(q, searchKeyword);
    } else {
      return (
        checkTags(q, searchTags) ||
        checkKeywords(q, searchKeyword)
      );
    }
  });
  return matchingQuestions;
};


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };