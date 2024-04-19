const express = require("express");
const User = require("../models/users");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const { checkReputation } =  require("../utils/reputation");
const { addComment } = require("../utils/comment");
const router = express.Router();

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