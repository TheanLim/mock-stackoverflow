const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vote_type: {
      type: String,
      required: true,
      enum: ["upvote", "downvote", "flag", "reopen", "close"]
    },
    vote_reason: {type: String, default: ""},

},
  { collection: "Vote" }
);