const Comment = require("../models/comments");
const User = require("../models/users");
const { handleVoteReputation, checkReputation } = require("../utils/reputation");

const addComment = async (req, res, Model) => {
    try {
        const user = await User.findById(req.session.user);

        const id = req.body.id;
        const text = req.body.text;
        const modelItem = await Model.findById(id).populate('comments').populate('postOwner');

        const reputationCheck = checkReputation(user, 'comment');
        if (!reputationCheck.success) {
            return res.status(401).json({ error: reputationCheck.error });
        }
        // Handle reputation
        await handleVoteReputation(user, modelItem.postOwner, 'comment', "apply");

        // Create a new vote
        const newComment = await Comment.create({
            text: text,
            comment_by: user,
            comment_date_time: new Date(),
        });
        // Update the Model with the new vote
        modelItem.comments.push(newComment);
        await modelItem.save();

        res.json(modelItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {addComment};
