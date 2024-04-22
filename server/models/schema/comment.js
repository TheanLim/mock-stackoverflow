const mongoose = require("mongoose");

// Schema for answers
const commentSchema = mongoose.Schema(
  {
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    text: {type: String, required: true},
    comment_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comment_date_time: {type: Date, required: true},
    votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
  },
  {collection: "Comment"}
);


// postOwner as the generic name of the user created the 'Post'
commentSchema.virtual('postOwner', {
  ref: 'User',
  localField: 'comment_by',
  foreignField: '_id',
  justOne: true
});

commentSchema.virtual('score').get(function(){
  let upvotes = this.votes.filter(vote => vote.vote_type === 'upvote').length;
  let downvotes = this.votes.filter(vote => vote.vote_type === 'downvote').length;
  return upvotes - downvotes;
});

commentSchema.pre('deleteOne', async function(next) {
  const modelId = this.getQuery()['_id'];
  const model = await this.model.findOne({ _id: modelId })
        .populate('votes');
    
    // Iterate through each reference and delete them
    await Promise.all([
        ...model.votes.map(vote => vote.deleteOne())
    ]);

    next();
});


module.exports = commentSchema;