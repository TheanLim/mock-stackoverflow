const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
  {
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    text: {type: String, required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
    score: {type: String, required: true, default: 0},
    ans_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ans_date_time: {type: Date, required: true},
  },
  {collection: "Answer"}
);