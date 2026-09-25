const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Get all available assessments with user's latest attempt status
// @route   GET /api/assessments
// @access  Public (or Private)
const getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find().select('-questions.correctAnswer -questions.explanation');

    let userResults = [];
    if (req.user) {
      userResults = await AssessmentResult.find({ user: req.user._id });
    }

    const resultMap = {};
    userResults.forEach((r) => {
      const aId = r.assessment.toString();
      if (!resultMap[aId] || r.percentage > resultMap[aId].percentage) {
        resultMap[aId] = r;
      }
    });

    const enrichedAssessments = assessments.map((a) => {
      const aObj = a.toObject();
      const bestResult = resultMap[a._id.toString()];
      aObj.hasAttempted = !!bestResult;
      aObj.bestScore = bestResult ? bestResult.score : null;
      aObj.bestPercentage = bestResult ? bestResult.percentage : null;
      aObj.bestLevel = bestResult ? bestResult.level : null;
      return aObj;
    });

    res.json({
      success: true,
      count: enrichedAssessments.length,
      assessments: enrichedAssessments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment for taking test
// @route   GET /api/assessments/:id
// @access  Private
const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // If student, do not expose correctAnswer in questions
    const assessmentObj = assessment.toObject();
    if (!req.user || req.user.role !== 'admin') {
      assessmentObj.questions = assessmentObj.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      }));
    }

    res.json({ success: true, assessment: assessmentObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assessment answers & calculate score
// @route   POST /api/assessments/:id/submit
// @access  Private
const submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of selectedOption indices: [0, 2, 1, 3, ...] or { questionIndex: number, selectedOption: number }
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    let score = 0;
    const totalQuestions = assessment.questions.length;
    const detailedAnswers = [];

    assessment.questions.forEach((q, index) => {
      let selectedOption = null;

      if (Array.isArray(answers)) {
        selectedOption = answers[index];
      } else if (answers && answers[index] !== undefined) {
        selectedOption = answers[index];
      }

      const isCorrect = selectedOption !== null && selectedOption === q.correctAnswer;
      if (isCorrect) {
        score++;
      }

      detailedAnswers.push({
        questionIndex: index,
        questionText: q.questionText,
        options: q.options,
        selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || '',
      });
    });

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    let level = 'Beginner';
    if (percentage >= 80) {
      level = 'Advanced';
    } else if (percentage >= 50) {
      level = 'Intermediate';
    }

    const result = await AssessmentResult.create({
      user: req.user._id,
      assessment: assessment._id,
      skill: assessment.skill,
      score,
      totalQuestions,
      percentage,
      level,
      answers: detailedAnswers,
    });

    // If passed with >= 70%, automatically update skill progress to Completed or In Progress
    if (percentage >= 70) {
      await Progress.findOneAndUpdate(
        { user: req.user._id, skill: { $regex: new RegExp(`^${assessment.skill}$`, 'i') } },
        {
          user: req.user._id,
          skill: assessment.skill,
          status: 'Completed',
          progress: 100,
          completedAt: new Date(),
          notes: `Passed assessment with score ${score}/${totalQuestions} (${percentage}%) - ${level}`,
        },
        { upsert: true, new: true }
      );

      // Add to user skills if not present
      const user = await User.findById(req.user._id);
      if (!user.skills.some((s) => s.toLowerCase() === assessment.skill.toLowerCase())) {
        user.skills.push(assessment.skill);
        await user.save();
      }
    } else if (percentage >= 40) {
      // In progress
      await Progress.findOneAndUpdate(
        { user: req.user._id, skill: { $regex: new RegExp(`^${assessment.skill}$`, 'i') } },
        {
          user: req.user._id,
          skill: assessment.skill,
          status: 'In Progress',
          progress: percentage,
          notes: `Attempted assessment: ${score}/${totalQuestions} (${percentage}%)`,
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      message: 'Assessment submitted successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's past assessment results
// @route   GET /api/assessments/results/me
// @access  Private
const getUserResults = async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ user: req.user._id })
      .populate('assessment', 'title difficulty durationMinutes')
      .sort({ completedAt: -1 });

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Assessment (Admin)
// @route   POST /api/assessments
// @access  Private/Admin
const createAssessment = async (req, res, next) => {
  try {
    const { title, skill, description, difficulty, durationMinutes, questions } = req.body;
    const assessment = await Assessment.create({
      title,
      skill,
      description,
      difficulty,
      durationMinutes,
      questions,
      totalQuestions: questions ? questions.length : 0,
    });
    res.status(201).json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Assessment (Admin)
// @route   PUT /api/assessments/:id
// @access  Private/Admin
const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Assessment (Admin)
// @route   DELETE /api/assessments/:id
// @access  Private/Admin
const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    await AssessmentResult.deleteMany({ assessment: req.params.id });
    res.json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssessments,
  getAssessmentById,
  submitAssessment,
  getUserResults,
  createAssessment,
  updateAssessment,
  deleteAssessment,
};
