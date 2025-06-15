const mongoose = require('mongoose');

// Each set includes weight and reps
const setSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  reps: { type: Number, required: true }
});

// Each exercise includes name and list of sets
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [setSchema]
});

// The workout itself
const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [exerciseSchema],
  notes: String
});

module.exports = mongoose.model('Workout', workoutSchema);
