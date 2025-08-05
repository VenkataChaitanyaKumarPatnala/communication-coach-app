const express = require('express');
const { getTestByType, submitTest, getTestResultsForUser } = require('../controllers/test.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/results', protect, getTestResultsForUser);
router.get('/:type', protect, getTestByType);
router.post('/submit', protect, submitTest);

module.exports = router;