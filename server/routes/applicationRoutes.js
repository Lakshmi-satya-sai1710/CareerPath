const express = require('express');
const {
  applyForJob,
  getMyApplications,
  updateApplicationNotes,
  updateApplicationStatus,
  getAllApplications,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMyApplications);
router.post('/:jobId', protect, applyForJob);
router.put('/:id/notes', protect, updateApplicationNotes);

// Admin endpoints
router.get('/all', protect, authorize('admin'), getAllApplications);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
