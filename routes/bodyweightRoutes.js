const express = require('express');
const router = express.Router();
const Bodyweight = require('../models/Bodyweight');
const protect = require('../middleware/authMiddleware');

// POST /api/bodyweights - Log new entry
router.post('/', protect, async (req, res) => {
  try {
    const { weight } = req.body;
    const newLog = new Bodyweight({ user: req.user._id, weight });
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/bodyweights - Get latest logs
router.get('/', protect, async (req, res) => {
  const logs = await Bodyweight.find({ user: req.user._id }).sort({ date: -1 });
  res.json(logs);
});

// ✅ NEW: GET /api/bodyweights/logs - Get logs for progress chart
router.get('/logs', protect, async (req, res) => {
  try {
    const logs = await Bodyweight.find({ user: req.user._id }).sort({ date: 1 }); // Ascending for graph
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
});

module.exports = router;
