const Career = require('../models/Career');
const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Get all careers with filtering & search
// @route   GET /api/careers
// @access  Public
const getCareers = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const careers = await Career.find(query).sort({ title: 1 });
    res.json({ success: true, count: careers.length, careers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single career by ID with related jobs
// @route   GET /api/careers/:id
// @access  Public
const getCareerById = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    // Find related jobs that share at least one required skill
    const relatedJobs = await Job.find({
      requiredSkills: { $in: career.requiredSkills },
    }).limit(4);

    res.json({ success: true, career, relatedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Select target career for current user
// @route   POST /api/careers/:id/select
// @access  Private
const selectTargetCareer = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    const user = await User.findById(req.user._id);
    user.targetCareer = career._id;
    await user.save();

    const populatedUser = await User.findById(user._id).populate('targetCareer');

    res.json({
      success: true,
      message: `Selected '${career.title}' as your target career!`,
      targetCareer: career,
      user: populatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new career (Admin)
// @route   POST /api/careers
// @access  Private/Admin
const createCareer = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, estimatedDuration, requiredSkills, roadmap, averageSalary, jobOutlook, icon } = req.body;

    const existing = await Career.findOne({ title });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Career title already exists' });
    }

    const career = await Career.create({
      title,
      description,
      category,
      difficulty,
      estimatedDuration,
      requiredSkills,
      roadmap: roadmap || [],
      averageSalary,
      jobOutlook,
      icon: icon || 'Code',
    });

    res.status(201).json({ success: true, message: 'Career created successfully', career });
  } catch (error) {
    next(error);
  }
};

// @desc    Update career (Admin)
// @route   PUT /api/careers/:id
// @access  Private/Admin
const updateCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    res.json({ success: true, message: 'Career updated successfully', career });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete career (Admin)
// @route   DELETE /api/careers/:id
// @access  Private/Admin
const deleteCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found' });
    }

    // Unset targetCareer for any users that selected this career
    await User.updateMany({ targetCareer: req.params.id }, { $set: { targetCareer: null } });

    res.json({ success: true, message: 'Career deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCareers,
  getCareerById,
  selectTargetCareer,
  createCareer,
  updateCareer,
  deleteCareer,
};
