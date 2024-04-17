const Comment = require("../models/comments");
const User = require("../models/users");
const Vote = require("../models/votes");
const { handleVoteReputation, checkReputation } = require("../utils/reputation");

const MAX_FLAGS = 6; // Delete a post when it's flagged more than this number of times
const MAX_CLOSE_REOPEN = 3; // Close a post when it's closed more than this number of times

const findExistingVote = (modelItem, user, voteType) => {
    if (voteType === 'upvote' || voteType === 'downvote') {
        return modelItem.votes.find(vote => vote.voter &&
            vote.voter.equals(user._id) &&
            (vote.vote_type === 'upvote' || vote.vote_type === 'downvote')
        );
    }
    else { // flag, close or reopen
        return modelItem.votes.find(vote => vote.voter &&
            vote.voter.equals(user._id) &&
            vote.vote_type === voteType
        );
    }
};

const handleExistingVote = async (res, user, modelItem, existingVote, voteType) => {
    if (voteType === 'upvote' || voteType === 'downvote') {
        if (existingVote.vote_type !== voteType) { // such as switching from 'upvote' to 'downvote'
            // Requires a reputation check of the opposite voteType before casting vote
            const reputationCheck = checkReputation(user, voteType);
            if (!reputationCheck.success) {
                res.status(401).json({ error: reputationCheck.error });
                return false; // indicate that further processing is not required
            }
            await handleVoteReputation(user, modelItem.postOwner, existingVote.vote_type, "revert");
            await Vote.deleteOne({ _id: existingVote._id });
            // no response has been sent, indicating further processing needed (such as creaating a new vote with voteType)
            return true
        }
        else { // existingVote.vote_type === voteType  -> simply undo by reverting the action
            await handleVoteReputation(user, modelItem.postOwner, existingVote.vote_type, "revert");
            await Vote.deleteOne({ _id: existingVote._id });
            res.json({ message: `Reverted ${existingVote.vote_type}` })
            return false; // indicate that further processing is not required
        }
    } else { // flag, close or reopen
        await handleVoteReputation(user, modelItem.postOwner, existingVote.vote_type, "revert");
        await Vote.deleteOne({ _id: existingVote._id });
        res.json({ message: `Reverted ${existingVote.vote_type}` });
        return false; // indicate that further processing is not required
    }
};

const handleThresholdExceeded = async (res, Model, id, modelItem, user, voteType) => {
    if (voteType === 'flag') {
        const flagVoteCnt = modelItem.votes.filter(vote => vote.vote_type === 'flag').length;
        if (flagVoteCnt >= MAX_FLAGS) {
            await handleVoteReputation(user, modelItem.postOwner, "flagExceeded", "apply");
            await Model.deleteOne({ _id: id });
            res.json({ message: `Deleted ${Model.modelName} with ID ${id} due to exceeding flag limit of ${MAX_FLAGS}` });
            return false; // indicate that further processing is not required
        }
    } else if (voteType === 'close' || voteType === 'reopen') {
        const voteTypeCount = modelItem.votes.filter(vote => vote.vote_type === voteType).length;
        if (voteTypeCount >= MAX_CLOSE_REOPEN) {
            modelItem.votes = modelItem.votes.filter(vote => vote.vote_type !== voteType);
            modelItem.status = (voteType === 'close') ? 'closed' : 'open';
            await modelItem.save();
        }
    }
    return true; //further processing is required
};

const addVote = async (req, res, Model) => {
    try {
        const user = await User.findById(req.session.user);

        const id = req.body.id;
        const voteType = req.body.vote_type;
        const voteReason = req.body.vote_reason ? req.body.vote_reason : '';

        const modelItem = await Model.findById(id)
            .populate('postOwner')
            .populate('votes');

        const existingVote = findExistingVote(modelItem, user, voteType);

        // Deal with casting the same votes multiple times
        if (existingVote) {
            const furtherProcessingNeeded = await handleExistingVote(res, user, modelItem, existingVote, voteType);
            if (!furtherProcessingNeeded)  return;
        }

        // Need to Create and insert new vote here
        // Check reputation
        const reputationCheck = checkReputation(user, voteType);
        if (!reputationCheck.success) {
            return res.status(401).json({ error: reputationCheck.error });
        }

        // Handle reputation
        if (Model !== Comment) { // no reputation changes on Comment vote (specifically upvote)
            await handleVoteReputation(user, modelItem.postOwner, voteType, "apply");
        }

        // Create a new vote
        const newVote = await Vote.create({
            voter: user._id,
            vote_type: voteType,
            vote_reason: voteReason,
        });

        // Update the Model with the new vote
        modelItem.votes.push(newVote);
        await modelItem.save();

        const furtherProcessingNeeded = await handleThresholdExceeded(res, Model, id, modelItem, user, voteType);
        if (!furtherProcessingNeeded) return; 

        return res.json(modelItem);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { addVote, MAX_FLAGS, MAX_CLOSE_REOPEN }