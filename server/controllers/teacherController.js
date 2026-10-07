const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');

// @desc    Get dashboard statistics for teacher
// @route   GET /api/teacher/statistics
// @access  Private (Teacher)
exports.getTeacherStatistics = async (req, res, next) => {
  try {
    // Quizzes created by this teacher
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    const quizIds = quizzes.map((q) => q._id);

    // Attempts for these quizzes
    const attempts = await QuizAttempt.find({ quiz: { $in: quizIds } })
      .populate('student', 'name email')
      .populate('quiz', 'title subject');

    const totalQuizzes = quizzes.length;
    const totalAttempts = attempts.length;

    // Unique students who attempted
    const studentIdSet = new Set(attempts.map((a) => a.student._id.toString()));
    const totalStudents = studentIdSet.size;

    // Total registered students on portal
    const totalRegisteredStudents = await User.countDocuments({ role: 'student' });

    let avgScore = 0;
    let passCount = 0;
    if (totalAttempts > 0) {
      const sumScore = attempts.reduce((acc, a) => acc + a.percentage, 0);
      avgScore = Math.round((sumScore / totalAttempts) * 10) / 10;
      passCount = attempts.filter((a) => a.result === 'PASS').length;
    }

    const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

    // Recent 5 submissions
    const recentAttempts = await QuizAttempt.find({ quiz: { $in: quizIds } })
      .populate('student', 'name email')
      .populate('quiz', 'title subject')
      .sort({ attemptedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalQuizzes,
        totalAttempts,
        totalStudents,
        totalRegisteredStudents,
        avgScore,
        passRate,
        recentAttempts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all student results for teacher's assessments with filters
// @route   GET /api/teacher/results
// @access  Private (Teacher)
exports.getTeacherResults = async (req, res, next) => {
  try {
    const { student, quiz, subject, result } = req.query;

    // Find teacher's quizzes
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    const quizIds = quizzes.map((q) => q._id);

    // Build filter
    let attemptFilter = { quiz: { $in: quizIds } };

    if (result && (result === 'PASS' || result === 'FAIL')) {
      attemptFilter.result = result;
    }

    let attempts = await QuizAttempt.find(attemptFilter)
      .populate('student', 'name email')
      .populate('quiz', 'title subject passingPercentage')
      .sort({ attemptedAt: -1 });

    // In-memory filter for student name and quiz title/subject
    if (student) {
      const sLower = student.toLowerCase();
      attempts = attempts.filter(
        (a) =>
          a.student &&
          (a.student.name.toLowerCase().includes(sLower) ||
            a.student.email.toLowerCase().includes(sLower))
      );
    }

    if (quiz) {
      const qLower = quiz.toLowerCase();
      attempts = attempts.filter((a) => a.quiz && a.quiz.title.toLowerCase().includes(qLower));
    }

    if (subject && subject !== 'All') {
      const subLower = subject.toLowerCase();
      attempts = attempts.filter(
        (a) => a.quiz && a.quiz.subject.toLowerCase().includes(subLower)
      );
    }

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    next(error);
  }
};
