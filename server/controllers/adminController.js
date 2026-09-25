const User = require('../models/User');
const Career = require('../models/Career');
const Skill = require('../models/Skill');
const Job = require('../models/Job');
const Application = require('../models/Application');
const AssessmentResult = require('../models/AssessmentResult');
const Assessment = require('../models/Assessment');

// @desc    Get comprehensive admin dashboard analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCareers = await Career.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalAssessmentAttempts = await AssessmentResult.countDocuments();
    const totalAssessments = await Assessment.countDocuments();

    // 1. Students grouped by Target Career
    const studentsByCareerAgg = await User.aggregate([
      { $match: { role: 'student', targetCareer: { $ne: null } } },
      { $group: { _id: '$targetCareer', count: { $sum: 1 } } },
      { $lookup: { from: 'careers', localField: '_id', foreignField: '_id', as: 'career' } },
      { $unwind: '$career' },
      { $project: { name: '$career.title', students: '$count' } },
      { $sort: { students: -1 } },
      { $limit: 6 },
    ]);

    // 2. Application Status distribution
    const applicationsByStatusAgg = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count' } },
    ]);

    // 3. Popular skills across all students
    const popularSkillsAgg = await User.aggregate([
      { $match: { role: 'student' } },
      { $unwind: '$skills' },
      { $group: { _id: { $toLower: '$skills' }, count: { $sum: 1 }, originalName: { $first: '$skills' } } },
      { $project: { skill: '$originalName', count: '$count' } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // 4. Assessment Performance Level distribution
    const assessmentLevelsAgg = await AssessmentResult.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
      { $project: { level: '$_id', count: '$count' } },
    ]);

    // 5. Recent registered students
    const recentStudents = await User.find({ role: 'student' })
      .select('name email college graduationYear createdAt targetCareer')
      .populate('targetCareer', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Recent job applications
    const recentApplications = await Application.find()
      .populate('student', 'name email')
      .populate('job', 'title company')
      .sort({ appliedDate: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCareers,
        totalSkills,
        totalJobs,
        totalApplications,
        totalAssessmentAttempts,
        totalAssessments,
      },
      charts: {
        studentsByCareer: studentsByCareerAgg,
        applicationsByStatus: applicationsByStatusAgg,
        popularSkills: popularSkillsAgg,
        assessmentLevels: assessmentLevelsAgg,
      },
      recentStudents,
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
};
