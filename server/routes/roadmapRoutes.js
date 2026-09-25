const express = require('express');
const { getUserRoadmap } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/user', protect, getUserRoadmap);

module.exports = router;
