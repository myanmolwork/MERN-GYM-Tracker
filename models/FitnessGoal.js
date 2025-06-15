const mongoose = require('mongoose');

const fitnessGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true
  },
  targetWorkouts: {
    type: Number,
    required: true,
    min: [1, 'Target workouts must be at least 1']
  },
  targetWeight: {
    type: Number,
    min: [0, 'Target weight must be a positive number'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('FitnessGoal', fitnessGoalSchema);
