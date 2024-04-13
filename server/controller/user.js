const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const csurf = require('csurf');


const router = express.Router();
const SALT_ROUNDS = 10;
//Set up csrf authentication
router.use(csurf());

const validateAuth = async (req, res) => {
  if (req.session && req.session.user) {
    res.json({user: req.session.user});
  } else {
    res.status(401).json({error: 'Unauthorized'})
  }
}

const validateCSRF = async (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

const logout = async (req, res) => {
  req.session.destroy(function(err) {
    if(err) {
      res.status(500).json({error: err});
    } else {
      res.json({message: 'Session deleted successfully'});
    }
  });
}

const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({error: 'User email and password are required.'})
    }

    const user = await User.findOne({email: email});
    if (!user) {
      // Authentication failed
      return res.status(401).json({error: 'Invalid email or password.'});
    }

    const comparedPasswords = await bcrypt.compare(password, user.password);
    if (!comparedPasswords) {
      // Authentication failed
      return res.status(401).json({error: "Invalid email or password."});
    }
    req.session.user = user._id;
    res.json({user: user._id});
  } catch (err) {
    res.status(500).json({});
  }
};

const signUp = async (req, res) => {
  try {
    let user = await User.findOne({email: req.body.email});
    if (user) {
      return res.status(403).json({error: 'Email already exists'});
    }
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const newUser = await User.create({
      ...req.body,
      reputation: 1,
      password: hashedPassword,
      date_joined: new Date(),
      time_last_seen: new Date(),
    });

    req.session.user = newUser._id;
    res.json({user: newUser._id});
  } catch (err) {
    res.status(500).json({error: 'Failed to create user: ' + err.message});
  }
};

router.get('/validateAuth', validateAuth);
router.post('/login', login);
router.get('/logout', logout);
router.post('/signUp', signUp);
router.get('/csrf-token', validateCSRF)

module.exports = router;
