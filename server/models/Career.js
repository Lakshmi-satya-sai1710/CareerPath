const mongoose = require('mongoose');

const roadmapStageSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  resources: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['Documentation', 'Course', 'Video', 'Article', 'Book'],
        default: 'Documentation',
      },
    },
  ],
});

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Career title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Career description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    estimatedDuration: {
      type: String,
      default: '6 Months',
    },
    requiredSkills: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A career must have at least one required skill',
      },
    },
    roadmap: [roadmapStageSchema],
    averageSalary: {
      type: String,
      default: '$75,000 - $115,000',
    },
    jobOutlook: {
      type: String,
      default: 'Very High (15% growth)',
    },
    icon: {
      type: String,
      default: 'Code',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Career', careerSchema);
