const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced'],
    required: true,
  },
  status: {
    type: String,
    enum: ['started', 'completed'],
    default: 'started',
  },
  questionsAndAnswers: [
    {
      question: String,
      userAnswer: String,
      feedback: String,
    },
  ],
  overallFeedback: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;