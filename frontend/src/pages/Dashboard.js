import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const calculateBMI = () => {
    if (!profile) return 0;
    const heightM = profile.height / 100;
    return (profile.weight / (heightM * heightM)).toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMIColor = (status) => {
    switch (status) {
      case 'Underweight': return 'danger';
      case 'Healthy': return 'success';
      case 'Overweight': return 'warning';
      case 'Obese': return 'danger';
      default: return 'secondary';
    }
  };

  const calculateGoalProgress = () => {
    const startWeight = 91; // Replace with actual backend value if available
    if (!profile) return 0;

    const { goalWeight, weight } = profile;
    if (!goalWeight || startWeight === goalWeight) return 0;

    const percent = ((startWeight - weight) / (startWeight - goalWeight)) * 100;
    return Math.min(Math.max(percent, 0), 100).toFixed(0);
  };

  const menuItems = [
    { icon: '➕', label: 'Add Workout', route: '/add-workout', color: 'primary' },
    { icon: '📄', label: 'View Workouts', route: '/workouts', color: 'secondary' },
    { icon: '⚖️', label: 'Log Bodyweight', route: '/log-weight', color: 'success' },
    { icon: '📈', label: 'Bodyweight Graph', route: '/bodyweight-progress', color: 'warning' },
    { icon: '📋', label: 'Bodyweight Logs', route: '/bodyweight-history', color: 'info' },
  ];

  if (loading || !profile) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <h4 className="mt-3">Loading dashboard...</h4>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiStatus = getBMIStatus(bmi);
  const bmiColor = getBMIColor(bmiStatus);
  const goalProgress = calculateGoalProgress();

  return (
    <div className="container py-5 mainBody">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold display-5 text-glow dashboard-heading">
          <span className="emoji">🏋️</span> Gym Progress Dashboard
        </h2>
        <p className="lead head-sub">Track your progress, stay motivated, and hit your fitness goals.</p>
      </div>

      {/* Profile & BMI */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card card-3d border-0 shadow-lg rounded-4 h-100 p-4 bg-white">
            <h5 className="text-primary mb-3 fw-semibold">🧍 Profile Info</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Name: <strong>{profile.name}</strong></li>
              <li className="list-group-item">Age: <strong>{profile.age}</strong></li>
              <li className="list-group-item">Height: <strong>{profile.height} cm</strong></li>
              <li className="list-group-item">Current Weight: <strong>{profile.weight} kg</strong></li>
              <li className="list-group-item">Goal Weight: <strong>{profile.goalWeight} kg</strong></li>
            </ul>
            <button
              className="btn btn-outline-primary mt-4 rounded-pill w-100"
              onClick={() => navigate('/edit-profile')}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* BMI Card */}
        <div className="col-md-6">
          <div className="card card-3d border-0 shadow-lg rounded-4 h-100 p-4 bg-white text-center">
            <h5 className="text-success mb-3 fw-semibold">🧠 BMI Status</h5>
            <div className="fs-3">BMI: <strong>{bmi}</strong> kg/m²</div>
            <div className={`badge bg-${bmiColor} fs-6 px-4 py-2 mt-3`}>
              {bmiStatus}
            </div>
            <p className="text-muted mt-3">Stay consistent for steady results!</p>
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="card card-3d border-0 white-box shadow-lg rounded-4 p-4 mb-5 bg-light">
        <h5 className="text-center mb-3 fw-semibold">🎯 Monthly Goal Progress</h5>
        <p className="text-center">
          Target: Reach <strong>{profile.goalWeight} kg</strong>
        </p>
        <div className="progress rounded-pill" style={{ height: '25px' }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-info"
            role="progressbar"
            style={{ width: `${goalProgress}%` }}
          >
            {goalProgress}% Complete
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="card card-3d border-0 white-box shadow-lg rounded-4 p-4 mb-5">
        <h5 className="text-center mb-4 fw-semibold">📊 Weight Trend</h5>
        <Line
          data={{
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Weight (kg)',
              data: [91, 90, 89.5, profile.weight],
              borderColor: 'orange',
              backgroundColor: 'rgba(255,165,0,0.1)',
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 8,
              fill: true,
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              tooltip: { mode: 'index', intersect: false },
            },
            scales: {
              y: {
                beginAtZero: false,
                title: { display: true, text: 'Weight (kg)' }
              },
              x: {
                title: { display: true, text: 'Time (Weeks)' }
              }
            }
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="row g-4 justify-content-center">
        {menuItems.map(({ icon, label, route, color }, i) => (
          <div className="col-sm-6 col-lg-4" key={i}>
            <div className="card card-3d h-100 border-0 shadow-sm rounded-4 hover-shadow bg-white">
              <div className="card-body text-center d-flex flex-column justify-content-between">
                <h5 className="card-title mb-3">{icon} {label}</h5>
                <button
                  className={`btn btn-${color} rounded-pill w-100`}
                  onClick={() => navigate(route)}
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="col-sm-6 col-lg-4">
          <div className="card card-3d h-100 border-0 shadow-sm rounded-4 bg-white">
            <div className="card-body text-center">
              <h5 className="text-danger mb-2" >🚪 Logout</h5>
              <p className="text-muted mb-3">End your session securely.</p>
              <button
                className="btn btn-danger db-l w-100 rounded-pill"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
