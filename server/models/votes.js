// Answer Document Schema
const mongoose = require("mongoose");

const Vote = require("./schema/vote");

module.exports = mongoose.model("Vote", Vote);
