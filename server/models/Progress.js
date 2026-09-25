const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    skill: {
      type: String,
      required: true,
      trim: true,
    },
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      default: null,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    notes: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user only has one progress record per skill
progressSchema.index({ user: 1, skill: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
