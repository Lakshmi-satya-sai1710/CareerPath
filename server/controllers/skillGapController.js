const User = require('../models/User');
const Career = require('../models/Career');
const Progress = require('../models/Progress');

// @desc    Get skill gap analysis for user against target or selected career
// @route   GET /api/skill-gap
// @access  Private
const getSkillGap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('targetCareer');
    const { careerId } = req.query;

    let targetCareer = null;
    if (careerId) {
      targetCareer = await Career.findById(careerId);
    } else if (user.targetCareer) {
      targetCareer = user.targetCareer;
    } else {
      // Default to first available career if none selected
      targetCareer = await Career.findOne().sort({ createdAt: 1 });
    }

    if (!targetCareer) {
      return res.status(404).json({
        success: false,
        message: 'No careers found to analyze. Please select or browse careers first.',
      });
    }

    const userSkills = (user.skills || []).map((s) => s.trim().toLowerCase());
    const requiredSkills = targetCareer.requiredSkills || [];

    const matchedSkills = [];
    const missingSkills = [];

    // Get any user progress recorded for these skills
    const progressRecords = await Progress.find({
      user: req.user._id,
      skill: { $in: requiredSkills },
    });

    const progressMap = {};
    progressRecords.forEach((pr) => {
      progressMap[pr.skill.toLowerCase()] = pr;
    });

    requiredSkills.forEach((skill) => {
      const lower = skill.toLowerCase();
      const hasSkill = userSkills.includes(lower);
      const pr = progressMap[lower];

      if (hasSkill || (pr && pr.status === 'Completed')) {
        matchedSkills.push({
          name: skill,
          status: 'Matched',
          progress: pr ? pr.progress : 100,
        });
      } else {
        missingSkills.push({
          name: skill,
          status: pr ? pr.status : 'Missing',
          progress: pr ? pr.progress : 0,
        });
      }
    });

    const totalRequired = requiredSkills.length;
    const matchCount = matchedSkills.length;
    const readinessPercentage = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 0;

    res.json({
      success: true,
      career: {
        _id: targetCareer._id,
        title: targetCareer.title,
        category: targetCareer.category,
        difficulty: targetCareer.difficulty,
        estimatedDuration: targetCareer.estimatedDuration,
        averageSalary: targetCareer.averageSalary,
        jobOutlook: targetCareer.jobOutlook,
      },
      isUserTargetCareer: user.targetCareer ? user.targetCareer._id.toString() === targetCareer._id.toString() : false,
      totalRequired,
      matchCount,
      missingCount: missingSkills.length,
      readinessPercentage,
      matchedSkills,
      missingSkills,
      userSkillCount: user.skills.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillGap,
};
