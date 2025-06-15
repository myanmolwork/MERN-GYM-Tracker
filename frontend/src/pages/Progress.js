import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../Dashboard.css';
import API from '../utils/api';

const Progress = () => {
  const navigate = useNavigate();
  const [weightLogs, setWeightLogs] = useState([]);
  const [workoutStats, setWorkoutStats] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchProgress = async () => {
    try {
      const [weightRes, workoutRes, profileRes] = await Promise.all([
        API.get('/bodyweights'),
        API.get('/workouts/stats'),
        API.get('/profile'),
      ]);

      // ✅ Bodyweight logs (sorted & sliced last 6)
      const weights = weightRes.data;
      console.log('Weight logs:', weights);
      const sortedWeights = weights.sort((a, b) => new Date(a.date) - new Date(b.date));
      setWeightLogs(sortedWeights.slice(-6));

      // ✅ Workout stats
      const workouts = workoutRes.data;
      console.log('Workout stats:', workouts);
      setWorkoutStats(workouts);

      // ✅ Profile
      const profileData = profileRes.data;
      console.log('Profile:', profileData);
      setProfile(profileData);

    } catch (err) {
      console.error('❌ Error fetching progress data:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProgress();
}, [navigate]);

  const calculateGoalProgress = () => {
    if (!profile) return 0;
    const startWeight = 91; // You can make this dynamic if needed
    const goal = profile.goalWeight;
    const current = profile.weight;
    const percent = ((startWeight - current) / (startWeight - goal)) * 100;
    return Math.min(Math.max(percent, 0), 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="container py-5 mainBody text-center">
        <p className="fw-bold">Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 mainBody">
      <h2 className="text-center fw-bold mb-4">📈 Your Progress Overview</h2>

      {/* Weight Trend Graph */}
      <div className="card card-3d p-4 mb-5 shadow-lg rounded-4 bg-white">
        <h5 className="text-center mb-3">Bodyweight Over Time</h5>
        {weightLogs.length > 0 ? (
          <Line
            data={{
              labels: weightLogs.map((log) =>
                new Date(log.date).toLocaleDateString()
              ),
              datasets: [
                {
                  label: 'Weight (kg)',
                  data: weightLogs.map((log) => log.weight),
                  borderColor: 'teal',
                  backgroundColor: 'rgba(0, 128, 128, 0.1)',
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={{ responsive: true }}
          />
        ) : (
          <p className="text-center text-muted">No bodyweight data available.</p>
        )}
      </div>

      {/* Workout Frequency */}
      <div className="card card-3d p-4 mb-5 shadow-lg rounded-4 bg-white">
        <h5 className="text-center mb-3">Weekly Workout Count</h5>
        {workoutStats.length > 0 ? (
          <Bar
            data={{
              labels: workoutStats.map((item) => `Week ${item.week}`),
              datasets: [
                {
                  label: 'Workouts',
                  data: workoutStats.map((item) => item.count),
                  backgroundColor: 'orange',
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                },
              },
            }}
          />
        ) : (
          <p className="text-center text-muted">No workout data available.</p>
        )}
      </div>

      {/* Goal Progress */}
      {profile && (
        <div className="card card-3d p-4 mb-5 shadow-lg rounded-4 bg-light">
          <h5 className="text-center mb-2">🎯 Monthly Goal</h5>
          <p className="text-center">
            Target: Reach <strong>{profile.goalWeight} kg</strong>
          </p>
          <div className="progress rounded-pill" style={{ height: '25px' }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-success"
              role="progressbar"
              style={{ width: `${calculateGoalProgress()}%` }}
            >
              {calculateGoalProgress()}% Complete
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center">
        <button
          className="btn btn-outline-dark rounded-pill"
          onClick={() => navigate('/dashboard')}
        >
          ⬅️ Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Progress;
