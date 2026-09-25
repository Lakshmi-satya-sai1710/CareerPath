const express = require('express');
const {
  getCareers,
  getCareerById,
  selectTargetCareer,
  createCareer,
  updateCareer,
  deleteCareer,
} = require('../controllers/careerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getCareers)
  .post(protect, authorize('admin'), createCareer);

router.route('/:id')
  .get(getCareerById)
  .put(protect, authorize('admin'), updateCareer)
  .delete(protect, authorize('admin'), deleteCareer);

router.post('/:id/select', protect, selectTargetCareer);

module.exports = router;
