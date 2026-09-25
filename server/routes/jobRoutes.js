const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getJobs);
router.get('/:id', optionalProtect, getJobById);

router.post('/', protect, authorize('admin'), createJob);
router.put('/:id', protect, authorize('admin'), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);

module.exports = router;
