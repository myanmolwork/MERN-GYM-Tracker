const mongoose = require('mongoose');
const Workout = require('../models/Workout');

// @desc    Add a new workout
// @route   POST /api/workouts
// @access  Private
const addWorkout = async (req, res) => {
  try {
    const { exercises, notes } = req.body;

    const newWorkout = new Workout({
      user: req.user._id,
      exercises,
      notes,
    });

    const savedWorkout = await newWorkout.save();

    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('❌ Add Workout Error:', error);
    res.status(500).json({ message: 'Server error while adding workout', error: error.message });
  }
};

// @desc    Get all workouts for the logged-in user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    console.error('❌ Get Workouts Error:', error);
    res.status(500).json({ message: 'Server error while fetching workouts', error: error.message });
  }
};

// @desc    Delete a workout by ID
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid workout ID format' });
    }

    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this workout' });
    }

    await workout.deleteOne();

    res.status(200).json({ message: '✅ Workout deleted successfully' });
  } catch (error) {
    console.error('❌ Workout Delete Error:', error);
    res.status(500).json({ message: 'Server error while deleting workout', error: error.message });
  }
};
const getWorkoutStats = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });

    const grouped = {};
    workouts.forEach(w => {
      const date = new Date(w.date);
      const week = getWeekNumber(date);
      grouped[week] = (grouped[week] || 0) + 1;
    });

    const result = Object.entries(grouped).map(([week, count]) => ({
      week,
      count,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get workout stats', error: err.message });
  }
};

function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

// ✅ Export all handlers
module.exports = {
  addWorkout,
  getWorkouts,
  deleteWorkout,
  getWorkoutStats, 
};
