const Career = require('../models/Career');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Skill = require('../models/Skill');

// @desc    Get personalized dynamic roadmap for logged-in user
// @route   GET /api/roadmaps/user
// @access  Private
const getUserRoadmap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('targetCareer');
    const { careerId } = req.query;

    let career = null;
    if (careerId) {
      career = await Career.findById(careerId);
    } else if (user.targetCareer) {
      career = user.targetCareer;
    } else {
      career = await Career.findOne().sort({ createdAt: 1 });
    }

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'No career found to generate roadmap. Please select a target career.',
      });
    }

    const userSkills = (user.skills || []).map((s) => s.trim().toLowerCase());

    // Fetch all user progress records
    const progressRecords = await Progress.find({ user: req.user._id });
    const progressMap = {};
    progressRecords.forEach((pr) => {
      progressMap[pr.skill.toLowerCase()] = pr;
    });

    // Fetch skills metadata for resources/descriptions
    const allSkillsMetadata = await Skill.find();
    const skillMetaMap = {};
    allSkillsMetadata.forEach((s) => {
      skillMetaMap[s.name.toLowerCase()] = s;
    });

    let totalMilestones = 0;
    let completedMilestones = 0;

    // Process roadmap stages
    const enrichedRoadmap = (career.roadmap || []).map((stage) => {
      const enrichedSkills = (stage.skills || []).map((skillName) => {
        totalMilestones++;
        const lower = skillName.toLowerCase();
        const hasSkillInProfile = userSkills.includes(lower);
        const progressDoc = progressMap[lower];
        const meta = skillMetaMap[lower];

        let status = 'Not Started';
        let progressVal = 0;

        if (progressDoc) {
          status = progressDoc.status;
          progressVal = progressDoc.progress;
        } else if (hasSkillInProfile) {
          status = 'Completed';
          progressVal = 100;
        }

        if (status === 'Completed') {
          completedMilestones++;
        }

        return {
          skill: skillName,
          status,
          progress: progressVal,
          description: meta ? meta.description : `Master ${skillName} fundamentals, practical applications, and industry best practices.`,
          difficulty: meta ? meta.difficulty : stage.level <= 2 ? 'Beginner' : stage.level <= 4 ? 'Intermediate' : 'Advanced',
          resources: meta && meta.resources && meta.resources.length > 0
            ? meta.resources
            : stage.resources || [
                {
                  title: `${skillName} Official Documentation`,
                  url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}`,
                  type: 'Documentation',
                },
                {
                  title: `${skillName} Complete Guide & Tutorial`,
                  url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' full tutorial course')}`,
                  type: 'Course',
                },
              ],
        };
      });

      return {
        level: stage.level,
        title: stage.title,
        description: stage.description,
        skills: enrichedSkills,
        isCompleted: enrichedSkills.length > 0 && enrichedSkills.every((s) => s.status === 'Completed'),
      };
    });

    const overallProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    res.json({
      success: true,
      career: {
        _id: career._id,
        title: career.title,
        category: career.category,
        difficulty: career.difficulty,
        estimatedDuration: career.estimatedDuration,
        averageSalary: career.averageSalary,
        requiredSkills: career.requiredSkills,
      },
      isUserTargetCareer: user.targetCareer ? user.targetCareer._id.toString() === career._id.toString() : false,
      overallProgress,
      totalMilestones,
      completedMilestones,
      roadmap: enrichedRoadmap,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserRoadmap,
};
