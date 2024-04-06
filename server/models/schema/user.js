const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    reputation: {type: Number, default: 1, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    display_name: {type: String, required: true},
    about_summary: {type: String, default: ""},
    date_joined: {type: Date, required: true},
    time_last_seen: {type: Date, required: true},
  },
  { collection: "User" }
);