// routes/progress.js
router.get('/progress-data', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const workouts = await Workout.find({ userId }).sort({ date: 1 });
  const weights = await Bodyweight.find({ userId }).sort({ date: 1 });

  res.json({
    workouts: workouts.map(w => ({ date: w.date, totalSets: w.sets.length })),
    weights: weights.map(w => ({ date: w.date, weight: w.weight }))
  });
});
