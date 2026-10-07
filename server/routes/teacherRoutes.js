const express = require('express');
const router = express.Router();
const {
  getTeacherStatistics,
  getTeacherResults
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('teacher'));

router.get('/statistics', getTeacherStatistics);
router.get('/results', getTeacherResults);

module.exports = router;
