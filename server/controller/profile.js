const express = require("express");
const User = require("../models/users");
const Question = require("../models/questions");

const router = express.Router();

const getUserQuestions = (user) => {
  return Question.find({asked_by: user})
    .sort({ask_date_time: 'desc'});
}

const getUserAnsQuestions = (user) => {
  return Question.find() // Find all questions
    .populate({
      path: 'answers', // Populate the 'answers' field
      match: {ans_by: user._id}
    });
}

// Given a user id to view a profile, return the associated user object.
// Return a boolean flag denoting if a logged-in user is viewing their own profile.
const viewProfile = async (req, res) => {
  try {
    let currentlyLoggedIn = "";
    if (req.session && req.session.user) {
      currentlyLoggedIn = req.session.user;
    }
    const user = await User.findById(req.params.uid);
    if (!user) {
      res.status(401).json({error: "Incorrect id to profile."})
    } else {
      const userQuestions = await getUserQuestions(user);
      const allQuestions = await getUserAnsQuestions(user);
      const userAnswers = allQuestions.filter(q => q.answers.length > 0)
        .sort((a, b) => (
          b.answers[0].ans_date_time - a.answers[0].ans_date_time
        ));
      res.json({
        profile: user,
        profileOwner: currentlyLoggedIn === user._id.toString(),
        questions: userQuestions,
        answers: userAnswers,
      });
    }
  } catch (err) {
    res.status(500).json({error: "Failed to find user profile"});
  }
}

const editProfile = async (req, res) => {
  try {
    let userChanges = req.body;
    //TODO: MOVE CHECK FOR EXISTING USERS TO UTILS
    let existing = await User.findOne({display_name: userChanges.display_name});
    if (existing && existing._id.toString() !== req.session.user) {
      return res.status(403).json({error: 'New Display Name already exists'});
    }
    existing = await User.findOne({email: userChanges.email});
    if (existing && existing._id.toString() !== req.session.user) {
      return res.status(403).json({error: 'New email already exists'});
    }

    const updatedUser = await User.findByIdAndUpdate(req.session.user, userChanges);
    res.json({user: updatedUser._id})
  } catch (err) {
    res.status(500).json({error: "Failed to update profile."});
  }

}

router.get('/view/:uid', viewProfile);
router.post('/edit', editProfile);

module.exports = router;