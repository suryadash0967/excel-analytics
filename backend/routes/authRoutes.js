const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');

// Email login/register
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth with role from query
router.get('/google', (req, res, next) => {
  req.session.role = req.query.role; // Store role in session
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.googleId, role: req.user.role },
      process.env.JWT_SECRET
    );
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/twitter/callback',
  passReqToCallback: true
}, (req, token, tokenSecret, profile, done) => {
  const role = req.session.role || 'user';
  const user = {
    twitterId: profile.id,
    name: profile.displayName,
    role
  };
  return done(null, user);
}));



// ADD FOR FACEBOOK TOO




module.exports = router;
