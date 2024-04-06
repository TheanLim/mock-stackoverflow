const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
  {
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    text: {type: String, required: true},
    comment_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comment_date_time: {type: Date, required: true},
    votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
  },
  {collection: "Comment"}
);