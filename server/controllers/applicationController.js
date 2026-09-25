const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Student)
const applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const alreadyApplied = await Application.findOne({
      student: req.user._id,
      job: job._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const { notes } = req.body;

    const application = await Application.create({
      student: req.user._id,
      job: job._id,
      status: 'Applied',
      notes: notes || '',
    });

    const populated = await Application.findById(application._id).populate('job');

    res.status(201).json({
      success: true,
      message: `Successfully applied to ${job.company} for ${job.title}!`,
      application: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's applications
// @route   GET /api/applications/me
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student's personal notes on an application
// @route   PUT /api/applications/:id/notes
// @access  Private
const updateApplicationNotes = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.notes = req.body.notes !== undefined ? req.body.notes : application.notes;
    await application.save();

    res.json({
      success: true,
      message: 'Notes updated',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Admin/HR)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('student', 'name email college graduationYear').populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications/all
// @access  Private/Admin
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email college graduationYear skills')
      .populate('job')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  updateApplicationNotes,
  updateApplicationStatus,
  getAllApplications,
};
