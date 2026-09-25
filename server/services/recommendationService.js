const User = require('../models/User');
const Career = require('../models/Career');
const Progress = require('../models/Progress');
const AssessmentResult = require('../models/AssessmentResult');
const Skill = require('../models/Skill');

/**
 * Generate intelligent, multi-factor recommendations for a user
 * @param {String} userId - Mongo ID of the user
 */
const getRecommendationsForUser = async (userId) => {
  const user = await User.findById(userId).populate('targetCareer');
  if (!user) {
    throw new Error('User not found');
  }

  // Fallback to first career if user hasn't selected one
  let career = user.targetCareer;
  if (!career) {
    career = await Career.findOne().sort({ createdAt: 1 });
  }

  if (!career) {
    return {
      primarySkill: null,
      nextSkills: [],
      careerRecommendations: [],
      assessmentRecommendations: [],
      readiness: 0,
      summary: 'Please add careers to receive recommendations.',
    };
  }

  const userSkillsLower = (user.skills || []).map((s) => s.trim().toLowerCase());

  // Fetch all progress records
  const progressList = await Progress.find({ user: userId });
  const progressMap = {};
  progressList.forEach((p) => {
    progressMap[p.skill.toLowerCase()] = p;
  });

  // Fetch assessment results
  const assessmentResults = await AssessmentResult.find({ user: userId }).sort({ completedAt: -1 });
  const assessmentMap = {};
  assessmentResults.forEach((ar) => {
    if (!assessmentMap[ar.skill.toLowerCase()]) {
      assessmentMap[ar.skill.toLowerCase()] = ar;
    }
  });

  // Fetch all skill metadata
  const allSkills = await Skill.find();
  const skillMetaMap = {};
  allSkills.forEach((s) => {
    skillMetaMap[s.name.toLowerCase()] = s;
  });

  // 1. Identify missing skills in roadmap order
  const recommendedSkills = [];
  const requiredSkills = career.requiredSkills || [];

  // Inspect roadmap stages sequentially for pedagogical order
  if (career.roadmap && career.roadmap.length > 0) {
    career.roadmap.forEach((stage) => {
      stage.skills.forEach((skillName) => {
        const lower = skillName.toLowerCase();
        const hasSkill = userSkillsLower.includes(lower);
        const progressDoc = progressMap[lower];

        if (!hasSkill && (!progressDoc || progressDoc.status !== 'Completed')) {
          const meta = skillMetaMap[lower];
          recommendedSkills.push({
            name: skillName,
            level: stage.level,
            stageTitle: stage.title,
            priority: stage.level <= 2 ? 'High Priority' : stage.level <= 4 ? 'Medium Priority' : 'Next Step',
            reason: `Essential milestone for ${career.title} (Level ${stage.level}: ${stage.title})`,
            progress: progressDoc ? progressDoc.progress : 0,
            status: progressDoc ? progressDoc.status : 'Not Started',
            resources: meta && meta.resources ? meta.resources : stage.resources || [],
            category: meta ? meta.category : 'Development',
            difficulty: meta ? meta.difficulty : stage.level <= 2 ? 'Beginner' : 'Intermediate',
          });
        }
      });
    });
  }

  // If roadmap didn't capture all requiredSkills, check requiredSkills directly
  requiredSkills.forEach((skillName) => {
    const lower = skillName.toLowerCase();
    const alreadyIncluded = recommendedSkills.some((rs) => rs.name.toLowerCase() === lower);
    const hasSkill = userSkillsLower.includes(lower);
    const progressDoc = progressMap[lower];

    if (!alreadyIncluded && !hasSkill && (!progressDoc || progressDoc.status !== 'Completed')) {
      const meta = skillMetaMap[lower];
      recommendedSkills.push({
        name: skillName,
        level: 3,
        stageTitle: 'Core Competency',
        priority: 'Medium Priority',
        reason: `Required core skill for ${career.title}`,
        progress: progressDoc ? progressDoc.progress : 0,
        status: progressDoc ? progressDoc.status : 'Not Started',
        resources: meta && meta.resources ? meta.resources : [],
        category: meta ? meta.category : 'Development',
        difficulty: meta ? meta.difficulty : 'Intermediate',
      });
    }
  });

  // 2. Identify assessment recommendations (skills where score was low or hasn't been tested yet)
  const assessmentRecommendations = [];
  user.skills.forEach((skillName) => {
    const lower = skillName.toLowerCase();
    const result = assessmentMap[lower];
    if (result && result.percentage < 60) {
      assessmentRecommendations.push({
        skill: skillName,
        type: 'Retake / Reinforce',
        message: `Your last score in ${skillName} was ${result.percentage}%. Reinforce fundamentals to reach Advanced status.`,
        lastScore: result.percentage,
      });
    }
  });

  // 3. Alternative career matching based on existing user skills
  const allCareers = await Career.find({ _id: { $ne: career._id } });
  const careerRecommendations = allCareers
    .map((c) => {
      const req = c.requiredSkills || [];
      const matched = req.filter((s) => userSkillsLower.includes(s.toLowerCase())).length;
      const matchPct = req.length > 0 ? Math.round((matched / req.length) * 100) : 0;
      return {
        _id: c._id,
        title: c.title,
        category: c.category,
        difficulty: c.difficulty,
        matchPercentage: matchPct,
        matchedCount: matched,
        totalRequired: req.length,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 3);

  // Calculate readiness
  const totalRequired = requiredSkills.length;
  const matchedCount = requiredSkills.filter((s) => userSkillsLower.includes(s.toLowerCase())).length;
  const readiness = totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 0;

  const primarySkill = recommendedSkills.length > 0 ? recommendedSkills[0] : null;

  return {
    targetCareer: {
      _id: career._id,
      title: career.title,
      category: career.category,
      difficulty: career.difficulty,
    },
    readiness,
    primarySkill,
    nextSkills: recommendedSkills.slice(0, 4),
    allPendingSkillsCount: recommendedSkills.length,
    careerRecommendations,
    assessmentRecommendations,
  };
};

module.exports = {
  getRecommendationsForUser,
};
