const express = require('express');
const router = express.Router();
const { setGoal, getGoal } = require('../controllers/goalController');
const protect = require('../middleware/authMiddleware');

router.post('/set-goal', protect, setGoal);
router.get('/get-goal', protect, getGoal);

module.exports = router;
