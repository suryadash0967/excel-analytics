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
      { id: req.user._id, role: req.user.role, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET
    );

    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);


module.exports = router;
