const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const testSchema = new mongoose.Schema({
  testType: {
    type: String,
    enum: ['Grammar', 'Vocabulary', 'Comprehension'],
    required: true,
    unique: true,
  },
  questions: [questionSchema],
});

module.exports = mongoose.model('Test', testSchema);