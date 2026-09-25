const express = require('express');
const { getProgress, updateSkillProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getProgress);
router.put('/:skill', protect, updateSkillProgress);

module.exports = router;
