const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

// @desc   Get current user's profile
// @route  GET /api/profile
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @desc   Update user profile (Partial update supported)
// @route  PUT /api/profile
// @access Private
router.put('/', protect, async (req, res) => {
  const updates = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update only provided fields
    Object.keys(updates).forEach(key => {
      if (key in user) user[key] = updates[key];
    });

    await user.save();

    res.json({
      msg: '✅ Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        goalWeight: user.goalWeight,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
