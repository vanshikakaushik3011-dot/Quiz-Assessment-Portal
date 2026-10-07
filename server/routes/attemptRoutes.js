const express = require('express');
const router = express.Router();
const {
  submitAttempt,
  getMyResults,
  getAttemptById
} = require('../controllers/attemptController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Student submit attempt
router.post('/', authorize('student'), submitAttempt);

// Student view their results
router.get('/my-results', authorize('student'), getMyResults);

// View specific attempt details (student or teacher)
router.get('/:id', getAttemptById);

module.exports = router;
