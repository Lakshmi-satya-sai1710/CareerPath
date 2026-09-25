const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// Helper to calculate job-student skill match
const calculateJobMatch = (jobSkills, studentSkills) => {
  const normalizedStudent = (studentSkills || []).map((s) => s.trim().toLowerCase());
  const required = jobSkills || [];

  if (required.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      matchedCount: 0,
      totalRequired: 0,
    };
  }

  const matched = [];
  const missing = [];

  required.forEach((s) => {
    if (normalizedStudent.includes(s.trim().toLowerCase())) {
      matched.push(s);
    } else {
      missing.push(s);
    }
  });

  const matchPercentage = Math.round((matched.length / required.length) * 100);

  return {
    matchPercentage,
    matchedSkills: matched,
    missingSkills: missing,
    matchedCount: matched.length,
    totalRequired: required.length,
  };
};

// @desc    Get all jobs with search, filters & personalized skill match %
// @route   GET /api/jobs
// @access  Public (or Private to calculate student match)
const getJobs = async (req, res, next) => {
  try {
    const { location, jobType, search, skill } = req.query;
    let query = {};

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (skill && skill !== 'All') {
      query.requiredSkills = { $in: [new RegExp(`^${skill}$`, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    // If student user is logged in, attach personalized matching and application status
    let userSkills = [];
    let appliedJobIds = new Set();

    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) userSkills = user.skills || [];

      const applications = await Application.find({ student: req.user._id });
      appliedJobIds = new Set(applications.map((a) => a.job.toString()));
    }

    const enrichedJobs = jobs.map((job) => {
      const jobObj = job.toObject();
      const match = calculateJobMatch(job.requiredSkills, userSkills);
      jobObj.matchPercentage = match.matchPercentage;
      jobObj.matchedSkills = match.matchedSkills;
      jobObj.missingSkills = match.missingSkills;
      jobObj.hasApplied = appliedJobIds.has(job._id.toString());
      return jobObj;
    });

    res.json({
      success: true,
      count: enrichedJobs.length,
      jobs: enrichedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID with detailed match breakdown
// @route   GET /api/jobs/:id
// @access  Public / Private
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const jobObj = job.toObject();
    let userSkills = [];
    let application = null;

    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) userSkills = user.skills || [];

      application = await Application.findOne({ student: req.user._id, job: job._id });
    }

    const match = calculateJobMatch(job.requiredSkills, userSkills);
    jobObj.matchPercentage = match.matchPercentage;
    jobObj.matchedSkills = match.matchedSkills;
    jobObj.missingSkills = match.missingSkills;
    jobObj.hasApplied = !!application;
    jobObj.application = application;

    res.json({ success: true, job: jobObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Job (Admin)
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res, next) => {
  try {
    const { title, company, location, jobType, description, requiredSkills, salary, experience, applicationUrl } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
      salary: salary || 'Competitive',
      experience: experience || '0-2 Years',
      applicationUrl: applicationUrl || '',
    });

    res.status(201).json({ success: true, message: 'Job posted successfully', job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Job (Admin)
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.requiredSkills === 'string') {
      updateData.requiredSkills = updateData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Job (Admin)
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await Application.deleteMany({ job: req.params.id });

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
