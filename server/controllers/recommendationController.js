const recommendationService = require('../services/recommendationService');

// @desc    Get smart recommendations for current user
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const data = await recommendationService.getRecommendationsForUser(req.user._id);
    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
