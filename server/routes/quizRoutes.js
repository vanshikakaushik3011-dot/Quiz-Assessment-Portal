const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

// Optional auth for GET to tailor response if teacher
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getQuizzes);
router.get('/:id', optionalAuth, getQuizById);

// Teacher only routes
router.post('/', protect, authorize('teacher'), createQuiz);
router.put('/:id', protect, authorize('teacher'), updateQuiz);
router.delete('/:id', protect, authorize('teacher'), deleteQuiz);

module.exports = router;
