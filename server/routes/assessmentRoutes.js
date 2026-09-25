const express = require('express');
const {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  getUserResults,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require('../controllers/assessmentController');
const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getAssessments);
router.get('/results/me', protect, getUserResults);
router.get('/:id', optionalProtect, getAssessmentById);
router.post('/:id/submit', protect, submitAssessment);

router.post('/', protect, authorize('admin'), createAssessment);
router.put('/:id', protect, authorize('admin'), updateAssessment);
router.delete('/:id', protect, authorize('admin'), deleteAssessment);

module.exports = router;
