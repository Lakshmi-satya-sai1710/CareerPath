const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  updateUserSkills,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/skills')
  .put(protect, updateUserSkills);

module.exports = router;
