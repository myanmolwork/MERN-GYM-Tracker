import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BodyweightLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/bodyweights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📋 Your Bodyweight Logs</h2>
      <ul className="list-group">
        {logs.map((log) => (
          <li key={log._id} className="list-group-item d-flex justify-content-between">
            <span>{new Date(log.date).toLocaleDateString()}</span>
            <strong>{log.weight} kg</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BodyweightLogs;
