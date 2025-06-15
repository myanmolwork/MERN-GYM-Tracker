const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  addWorkout,
  getWorkouts,
  deleteWorkout,
  getWorkoutStats, // ✅ Added
} = require('../controllers/workoutControllers');

router.post('/', protect, addWorkout);
router.get('/', protect, getWorkouts);
router.delete('/:id', protect, deleteWorkout);

// ✅ NEW: GET /api/workouts/stats
router.get('/stats', protect, getWorkoutStats);

module.exports = router;
