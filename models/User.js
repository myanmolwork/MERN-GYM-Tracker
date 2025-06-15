const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    height: {
      type: Number, // cm
    },
    weight: {
      type: Number, // kg
    },
    goalWeight: {
      type: Number, // kg
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
