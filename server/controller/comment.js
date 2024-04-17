const express = require("express");
const User = require("../models/users");
const Comment = require("../models/comments");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const { handleVoteReputation, checkReputation } =  require("../utils/reputation");
const router = express.Router();

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
        await handleVoteReputation(user, modelItem.postOwner, 'comment', "apply")

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
        res.status(500).json({error: err.message});
    }
}
const addCommentToQuestion = async (req, res) =>{
    await addComment(req, res, Question);
}

const addCommentToAnswer = async (req, res) => {
    await addComment(req, res, Answer);
}

const isAuthorizedToComment = async (req, res) => {
    try {
        const user = await User.findById(req.session.user);
        const reputationCheck = checkReputation(user, 'comment');
        if (!reputationCheck.success) {
            return res.status(401).json({ error: reputationCheck.error });
        }
        return res.json(true);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}

router.post('/addCommentToQuestion', addCommentToQuestion)
router.post('/addCommentToAnswer', addCommentToAnswer)
router.get('/isAuthorizedToComment', isAuthorizedToComment)

module.exports = router;