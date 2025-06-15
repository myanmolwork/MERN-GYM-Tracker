import React, { useState } from 'react';
 // 👈 use the reusable API instance
import '../LogBodyweight.css';
import API from '../utils/api';

const LogBodyweight = () => {
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (weight <= 0) {
      setError('⚠️ Please enter a valid weight above 0 kg.');
      setMessage(null);
      return;
    }

    try {
      await API.post('/bodyweights', { weight });
      setMessage('✅ Bodyweight logged successfully!');
      setError(null);
      setWeight('');
    } catch (err) {
      setError('❌ Failed to log bodyweight.');
      setMessage(null);
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-5 log-weight">
      <div className="p-4 shadow rounded-4 bg-dark text-white">
        <h2 className="text-center mb-4">⚖️ Log Your Bodyweight</h2>

        {message && (
          <div className="alert alert-success text-center fw-semibold">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center fw-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Weight (kg)</label>
            <input
              type="number"
              className="form-control"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="1"
              placeholder="Enter your bodyweight"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-outline-light px-4">
              📥 Log Weight
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogBodyweight;
