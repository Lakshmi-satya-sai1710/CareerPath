const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Get user progress summary & items
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('targetCareer');
    const progressList = await Progress.find({ user: req.user._id }).sort({ updatedAt: -1 });

    const totalSkillsTracked = progressList.length;
    const completedSkills = progressList.filter((p) => p.status === 'Completed').length;
    const inProgressSkills = progressList.filter((p) => p.status === 'In Progress').length;
    const notStartedSkills = progressList.filter((p) => p.status === 'Not Started').length;

    // Monthly progress completion chart data (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyActivity = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      const count = progressList.filter((p) => {
        if (!p.updatedAt) return false;
        const pd = new Date(p.updatedAt);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      }).length;
      monthlyActivity.push({ month: mName, updates: count });
    }

    // Status breakdown chart data
    const statusData = [
      { name: 'Completed', value: completedSkills, color: '#10B981' },
      { name: 'In Progress', value: inProgressSkills, color: '#3B82F6' },
      { name: 'Not Started', value: notStartedSkills, color: '#6B7280' },
    ];

    const overallPercentage =
      totalSkillsTracked > 0 ? Math.round((completedSkills / totalSkillsTracked) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalSkillsTracked,
        completedSkills,
        inProgressSkills,
        notStartedSkills,
        overallPercentage,
      },
      chartData: {
        statusData,
        monthlyActivity,
      },
      progressList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update or create progress for a skill
// @route   PUT /api/progress/:skill
// @access  Private
const updateSkillProgress = async (req, res, next) => {
  try {
    const rawSkill = req.params.skill;
    const skillName = decodeURIComponent(rawSkill).trim();
    const { status, progress, notes } = req.body;

    let progressDoc = await Progress.findOne({
      user: req.user._id,
      skill: { $regex: new RegExp(`^${skillName}$`, 'i') },
    });

    let progressValue = progress !== undefined ? Number(progress) : undefined;
    let newStatus = status;

    if (newStatus === 'Completed') {
      progressValue = 100;
    } else if (newStatus === 'Not Started' && progressValue === undefined) {
      progressValue = 0;
    } else if (progressValue === 100 && !newStatus) {
      newStatus = 'Completed';
    } else if (progressValue > 0 && progressValue < 100 && !newStatus) {
      newStatus = 'In Progress';
    }

    if (!progressDoc) {
      progressDoc = new Progress({
        user: req.user._id,
        skill: skillName,
        status: newStatus || 'In Progress',
        progress: progressValue !== undefined ? progressValue : 0,
        notes: notes || '',
        completedAt: newStatus === 'Completed' ? new Date() : null,
      });
    } else {
      if (newStatus) progressDoc.status = newStatus;
      if (progressValue !== undefined) progressDoc.progress = progressValue;
      if (notes !== undefined) progressDoc.notes = notes;
      if (newStatus === 'Completed') {
        progressDoc.completedAt = new Date();
      } else if (newStatus === 'In Progress' || newStatus === 'Not Started') {
        progressDoc.completedAt = null;
      }
    }

    await progressDoc.save();

    // If completed, ensure it is in user's skills array
    const user = await User.findById(req.user._id);
    const hasInProfile = user.skills.some((s) => s.toLowerCase() === skillName.toLowerCase());

    if (progressDoc.status === 'Completed' && !hasInProfile) {
      user.skills.push(skillName);
      await user.save();
    } else if (progressDoc.status !== 'Completed' && hasInProfile && req.body.removeFromProfile) {
      user.skills = user.skills.filter((s) => s.toLowerCase() !== skillName.toLowerCase());
      await user.save();
    }

    res.json({
      success: true,
      message: `Progress for '${skillName}' updated to ${progressDoc.status}`,
      progress: progressDoc,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgress,
  updateSkillProgress,
};
