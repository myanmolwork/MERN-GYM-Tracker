import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const BodyweightProgress = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/bodyweights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedLogs = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLogs(sortedLogs);
        setError(null);
      } catch (err) {
        setError('❌ Failed to fetch bodyweight data.');
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const chartData = {
    labels: logs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Bodyweight (kg)',
        data: logs.map(log => log.weight),
        fill: false,
        borderColor: '#0d6efd',
        backgroundColor: '#0d6efd',
        tension: 0.3,
        pointBackgroundColor: '#198754',
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight (kg)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="container mt-5">
      <div className="p-4 shadow rounded-4 bg-light">
        <h2 className="text-center mb-4">📈 Bodyweight Progress</h2>

        {loading && <p className="text-center text-muted">Loading...</p>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && logs.length === 0 && !error && (
          <div className="text-center text-muted">No logs to display.</div>
        )}

        {!loading && logs.length > 0 && (
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => window.history.back()}
          >
            🔙 Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodyweightProgress;
