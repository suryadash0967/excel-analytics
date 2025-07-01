// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/profile', auth, (req, res) => {
  res.json({ msg: `Hello user ${req.user}` });
});

module.exports = router;
