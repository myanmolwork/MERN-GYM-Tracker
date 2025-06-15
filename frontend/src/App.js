import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddWorkout from './pages/AddWorkout';
import WorkoutList from './components/WorkoutList';
import LogBodyweight from './pages/LogBodyweight';
import BodyweightHistory from './pages/BodyweightHistory';
import BodyweightProgress from './pages/BodyweightProgress';
import ProtectedLayout from './components/ProtectedLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfile from './pages/EditProfile';
import './App.css';
import Progress from './pages/Progress';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Navbar */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-workout" element={<AddWorkout />} />
          <Route path="/workouts" element={<WorkoutList />} />
          <Route path="/log-weight" element={<LogBodyweight />} />
          <Route path="/bodyweight-history" element={<BodyweightHistory />} />
          <Route path="/bodyweight-progress" element={<BodyweightProgress />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
