const express = require("express");
const User = require("../models/users");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const Comment = require("../models/comments");
const { checkReputation } =  require("../utils/reputation");
const { addVote } = require("../utils/vote");
const router = express.Router();

const addVoteToQuestion = async (req, res) =>{
    await addVote(req, res, Question);
}

const addVoteToAnswer = async (req, res) => {
    await addVote(req, res, Answer);
}

const addVoteToComment = async (req, res) => {
    await addVote(req, res, Comment);
}

const isAuthorizedToVote = async (req, res) => {
    try {
        const user = await User.findById(req.session.user);
        const reputationCheck = checkReputation(user, req.params.voteType);
        if (!reputationCheck.success) {
            return res.status(401).json({ error: reputationCheck.error });
        }
        return res.json(true);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

router.post('/addVoteToQuestion', addVoteToQuestion)
router.post('/addVoteToAnswer', addVoteToAnswer)
router.post('/addVoteToComment', addVoteToComment)
router.get('/isAuthorizedToVote/:voteType', isAuthorizedToVote)

module.exports = router;