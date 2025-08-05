const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  score: { type: Number, required: true },
  answers: [{
    questionId: String,
    selectedAnswer: String,
    isCorrect: Boolean,
  }],
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestResult', testResultSchema);