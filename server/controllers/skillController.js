const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, count: skills.length, skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill (Admin)
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = async (req, res, next) => {
  try {
    const { name, category, description, difficulty, icon, resources } = req.body;

    const existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Skill already exists' });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category,
      description,
      difficulty,
      icon: icon || 'Sparkles',
      resources: resources || [],
    });

    res.status(201).json({ success: true, message: 'Skill created successfully', skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill (Admin)
// @route   PUT /api/skills/:id
// @access  Private/Admin
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, message: 'Skill updated successfully', skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill (Admin)
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
