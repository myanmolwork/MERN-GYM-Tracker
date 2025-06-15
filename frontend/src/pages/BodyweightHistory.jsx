import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../BodyweightHistory.css';
const BodyweightHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/bodyweights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(sorted);
        setError(null);
      } catch (err) {
        setError('❌ Failed to fetch bodyweight logs.');
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="container mt-5 bodyweight-logs-container">
      <div className="p-4 bg-light rounded-4 shadow-sm">
        <h2 className="text-center mb-4">📋 Bodyweight Logs</h2>

        {loading && <div className="text-center">⏳ Loading...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && logs.length === 0 && (
          <p className="text-center text-muted">No bodyweight logs found.</p>
        )}

        {!loading && logs.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log._id}>
                    <td>{index + 1}</td>
                    <td>{new Date(log.date).toLocaleDateString()}</td>
                    <td>{log.weight}</td>
                    <td>{log.note || <span className="text-muted">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyweightHistory;
