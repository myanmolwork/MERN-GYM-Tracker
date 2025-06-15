import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../WorkoutList.css';
import API from '../utils/api';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWorkouts = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await API.get('/workouts');
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      await API.delete(`/workouts/${id}`);
      setWorkouts(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete workout');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📄 Your Workouts</h2>

      {loading ? (
        <p className="text-center text-muted">Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p className="text-center text-muted">No workouts found.</p>
      ) : (
        <div className="row">
          {workouts.map((workout) => (
            <div className="col-md-6 mb-4" key={workout._id}>
              <div className="card border-0 shadow-sm rounded">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">
                      🗓 <span className="badge bg-info text-dark">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </h5>
                    <button
                      className="btn btn-sm delete-wrkt btn-outline-danger"
                      onClick={() => handleDelete(workout._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>

                  {workout.notes && (
                    <p className="text-muted mb-3">
                      <strong>📝 Notes:</strong> {workout.notes}
                    </p>
                  )}

                  {workout.exercises?.map((exercise, idx) => (
                    <div key={idx} className="mb-3 p-3 border rounded">
                      <h6 className="fw-bold exe-head mb-2">{exercise.name}</h6>

                      <table className="table table-sm table-bordered table-striped text-center mb-0 table-dark-theme">
                        <thead className="table-secondary">
                          <tr>
                            <th>Set</th>
                            <th>Reps</th>
                            <th>Weight (kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets?.map((set, setIndex) => (
                            <tr key={setIndex}>
                              <td>{setIndex + 1}</td>
                              <td>{set.reps}</td>
                              <td>{set.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <button
          className="btn btn-back-dashboard"
          onClick={() => navigate('/dashboard')}
        >
          🔙 Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WorkoutList;
