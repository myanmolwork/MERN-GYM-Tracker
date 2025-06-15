// controllers/profileController.js
const User = require('../models/User');

const updateProfile = async (req, res) => {
  const { name, age, height, weight, goalWeight } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.age = age || user.age;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.goalWeight = goalWeight || user.goalWeight;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

module.exports = { updateProfile };
