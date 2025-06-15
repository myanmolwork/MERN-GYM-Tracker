const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the path is correct

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for presence and structure of Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '🔒 Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token and decode user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user to check if they still exist (optional but safer)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: '❌ User no longer exists' });
    }

    // Attach user to request object (excluding sensitive info)
    req.user = user;

    next();
  } catch (err) {
    console.error('JWT auth error:', err.message);
    return res.status(401).json({ message: '❌ Unauthorized: Invalid or expired token' });
  }
};

module.exports = protect;
