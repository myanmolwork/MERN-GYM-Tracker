import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const BodyweightLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/bodyweights');
        // Sort logs by date descending
        const sortedLogs = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(sortedLogs);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch logs:', err);
        setError('Failed to fetch bodyweight logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">📋 Your Bodyweight Logs</h2>

      {loading && <p className="text-center">⏳ Loading...</p>}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && logs.length === 0 && !error && (
        <p className="text-center text-muted">No bodyweight logs found.</p>
      )}

      {!loading && logs.length > 0 && (
        <ul className="list-group shadow">
          {logs.map((log) => (
            <li key={log._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{new Date(log.date).toLocaleDateString()}</span>
              <strong>{log.weight} kg</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BodyweightLogs;
