const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('targetCareer');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      education,
      college,
      graduationYear,
      phone,
      bio,
      targetCareer,
      github,
      linkedin,
      resume,
      interests,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (education !== undefined) user.education = education;
    if (college !== undefined) user.college = college;
    if (graduationYear !== undefined) user.graduationYear = graduationYear ? Number(graduationYear) : null;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (targetCareer !== undefined) user.targetCareer = targetCareer || null;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (resume !== undefined) user.resume = resume;
    if (interests !== undefined && Array.isArray(interests)) user.interests = interests;

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('targetCareer');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: populatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user skills (Add/Remove/Replace)
// @route   PUT /api/users/skills
// @access  Private
const updateUserSkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { skills, action, skill } = req.body;

    if (action === 'add' && skill) {
      const trimmed = skill.trim();
      if (!user.skills.includes(trimmed)) {
        user.skills.push(trimmed);
      }
    } else if (action === 'remove' && skill) {
      user.skills = user.skills.filter((s) => s.toLowerCase() !== skill.trim().toLowerCase());
    } else if (Array.isArray(skills)) {
      // Replace entire skill list (deduplicated)
      user.skills = [...new Set(skills.map((s) => s.trim()))];
    }

    await user.save();
    const populated = await User.findById(user._id).populate('targetCareer');

    res.json({
      success: true,
      message: 'Skills updated successfully',
      skills: populated.skills,
      user: populated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserSkills,
};
