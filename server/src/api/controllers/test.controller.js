const Test = require('../models/test.model');
const TestResult = require('../models/testResult.model');

exports.getTestResultsForUser = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user.id })
      .sort({ completedAt: 1 })
      .populate('test', 'testType');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTestByType = async (req, res) => {
  try {
    const test = await Test.findOne({ testType: req.params.type });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { testId, userAnswers } = req.body;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let score = 0;
    const detailedAnswers = test.questions.map(question => {
      const questionId = question._id.toString();
      const selectedAnswer = userAnswers[questionId];
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score++;
      }
      return {
        questionId: questionId,
        selectedAnswer: selectedAnswer || '',
        isCorrect,
      };
    });

    const finalScore = (score / test.questions.length) * 100;

    const testResult = new TestResult({
      user: req.user.id,
      test: testId,
      score: finalScore,
      answers: detailedAnswers,
    });

    await testResult.save();
    res.status(201).json({ score: finalScore, resultId: testResult._id });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};