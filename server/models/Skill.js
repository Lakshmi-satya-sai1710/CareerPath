const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Data Science', 'Security', 'Tools & Methodologies', 'Core Fundamentals'],
      default: 'Core Fundamentals',
    },
    description: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          default: 'Documentation',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
