const mongoose = require("mongoose");

// Schema for questions
const questionSchema = mongoose.Schema(
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
    solution: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
    status: {
      type: String,
      required: true,
      enum: ["open", "closed"]
    }
  },
  {collection: "Question"}
);

// postOwner as the generic name of the user created the 'Post'
questionSchema.virtual('postOwner', {
  ref: 'User',
  localField: 'asked_by',
  foreignField: '_id',
  justOne: true
});


questionSchema.virtual('score').get(function(){
  let upvotes = this.votes.filter(vote => vote.vote_type === 'upvote').length;
  let downvotes = this.votes.filter(vote => vote.vote_type === 'downvote').length;
  return upvotes - downvotes;
});

questionSchema.pre('deleteOne', async function(next) {
  const modelId = this.getQuery()['_id'];
  const model = await this.model.findOne({ _id: modelId })
        .populate('answers comments votes');
    
    // Iterate through each reference and delete them
    await Promise.all([
        ...model.comments.map(comment => comment.deleteOne()),
        ...model.answers.map(answer => answer.deleteOne()),
        ...model.votes.map(vote => vote.deleteOne())
    ]);

    next();
});

module.exports = questionSchema;