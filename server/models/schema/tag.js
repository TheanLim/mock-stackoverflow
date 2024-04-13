const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: {type: String, required: true},
    },
    { collection: "Tag" }
);
