// Load environment variables at the top
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const bodyweightRoutes = require('./routes/bodyweightRoutes');
const goalRoutes = require('./routes/goalRoutes');
const profileRoutes = require('./routes/profile');

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/bodyweights', bodyweightRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/profile', profileRoutes);

// ✅ Base route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// ✅ 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
