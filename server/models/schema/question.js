const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
  {
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    asked_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ask_date_time: {type: Date, required: true},
    views: {type: Number, default: 0},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
    score: {type: Number, default: 0, required: true},
    solution: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
    status: {
      type: String,
      required: true,
      enum: ["open", "closed"]
    }
  },
  {collection: "Question"}
);