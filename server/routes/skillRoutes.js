const express = require('express');
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getSkills);
router.post('/', protect, authorize('admin'), createSkill);
router.put('/:id', protect, authorize('admin'), updateSkill);
router.delete('/:id', protect, authorize('admin'), deleteSkill);

module.exports = router;
