const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

router.put('/me', auth, async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
  res.json(user);
});

router.get('/', auth, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.userId } }).select('firstname lastname email mobileNumber');
  res.json(users);
});

module.exports = router;
