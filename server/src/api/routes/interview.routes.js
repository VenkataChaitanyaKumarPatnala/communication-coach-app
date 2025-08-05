const express = require('express');
const { startInterview, getNextQuestion, submitAnswer, getInterviewHistory } = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', protect, getInterviewHistory);
router.post('/', protect, startInterview);
router.post('/:id/next-question', protect, getNextQuestion);
router.post('/:interviewId/questions/:questionId/answer', protect, submitAnswer);

module.exports = router;