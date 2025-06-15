const FitnessGoal = require('../models/FitnessGoal');
const Workout = require('../models/Workout');

exports.setGoal = async (req, res) => {
  const { type, targetWorkouts = 0, targetWeight = 0 } = req.body;
  const userId = req.user.id;

  try {
    // Replace previous goal of same type (optional but good)
    await FitnessGoal.deleteMany({ userId, type });

    const goal = new FitnessGoal({
      userId,
      type,
      targetWorkouts,
      targetWeight
    });

    await goal.save();
    res.status(201).json({ message: "Goal set successfully!", goal });
  } catch (err) {
    console.error("Set Goal Error:", err);
    res.status(500).json({ error: "Error setting goal" });
  }
};

exports.getGoal = async (req, res) => {
  const userId = req.user.id;

  try {
    const goal = await FitnessGoal.findOne({ userId }).sort({ createdAt: -1 });

    if (!goal) {
      return res.status(404).json({ message: "No goal found", goal: null, progress: 0 });
    }

    // Calculate startDate based on goal type
    const now = new Date();
    const startDate = new Date(goal.createdAt); // Use the goal creation date for accurate tracking

    // Count workouts since the goal was set
    const completedWorkouts = await Workout.countDocuments({
      userId,
      createdAt: { $gte: startDate }
    });

    const progress = goal.targetWorkouts > 0
      ? Math.min(Math.round((completedWorkouts / goal.targetWorkouts) * 100), 100)
      : 0;

    res.status(200).json({
      goal,
      progress
    });
  } catch (err) {
    console.error("Get Goal Error:", err);
    res.status(500).json({ error: "Error fetching goal progress" });
  }
};
