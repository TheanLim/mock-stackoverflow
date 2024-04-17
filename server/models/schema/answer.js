const mongoose = require("mongoose");

// Schema for answers
const answerSchema = mongoose.Schema(
  {
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    text: {type: String, required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
    ans_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ans_date_time: {type: Date, required: true},
  },
  {collection: "Answer"},
);

// postOwner as the generic name of the user created the 'Post'
answerSchema.virtual('postOwner', {
  ref: 'User',
  localField: 'ans_by',
  foreignField: '_id',
  justOne: true
});

answerSchema.virtual('score').get(function(){
  if (this.votes.length === 0) {
    return 0;
  }
  let upvotes = this.votes.filter(vote => vote.vote_type === 'upvote').length;
  let downvotes = this.votes.filter(vote => vote.vote_type === 'downvote').length;
  return upvotes - downvotes;
});

answerSchema.pre('deleteOne', async function(next) {
  const modelId = this.getQuery()['_id'];
  const model = await this.model.findOne({ _id: modelId })
        .populate('comments votes');
    
    // Iterate through each reference and delete them
    await Promise.all([
        ...model.comments.map(comment => comment.deleteOne()),
        ...model.votes.map(vote => vote.deleteOne())
    ]);

    next();
});


module.exports = answerSchema;