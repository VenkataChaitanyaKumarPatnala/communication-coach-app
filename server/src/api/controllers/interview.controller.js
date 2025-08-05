const Interview = require('../models/interview.model');
const { getAIChatResponse } = require('../services/ai.service');

exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).sort({ createdAt: -1 });

    const historyWithCount = interviews.map(interview => {
      const answeredCount = interview.questionsAndAnswers.filter(qa => qa.userAnswer).length;
      return {
        ...interview.toObject(),
        answeredQuestionsCount: answeredCount
      };
    });

    res.json(historyWithCount);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.startInterview = async (req, res) => {
  try {
    const { difficulty } = req.body;
    if (!['Basic', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }

    const newInterview = new Interview({
      user: req.user.id,
      difficulty: difficulty,
      status: 'started',
    });

    const savedInterview = await newInterview.save();
    res.status(201).json(savedInterview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNextQuestion = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const askedQuestions = interview.questionsAndAnswers.map(qa => qa.question);

    const prompt = `
        Generate one ${interview.difficulty} level common HR interview question.
        Do not repeat any of the following questions:
        ${askedQuestions.join('\n')}
    `;
    
    const question = await getAIChatResponse(prompt);

    interview.questionsAndAnswers.push({ question });
    const savedInterview = await interview.save();

    res.json(savedInterview);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const interview = await Interview.findById(req.params.interviewId);
    const questionSubDoc = interview.questionsAndAnswers.id(req.params.questionId);

    if (!questionSubDoc) {
      return res.status(404).json({ message: "Question not found in this interview." });
    }

    questionSubDoc.userAnswer = answer;

    const feedbackPrompt = `The interview question was: "${questionSubDoc.question}". The user's answer is: "${answer}". Provide brief, constructive feedback for the user in 2-3 sentences.`;
    const feedback = await getAIChatResponse(feedbackPrompt);
    questionSubDoc.feedback = feedback;

    await interview.save();
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};