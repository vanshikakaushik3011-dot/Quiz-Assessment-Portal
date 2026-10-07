const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Submit a quiz attempt and automatically calculate score
// @route   POST /api/attempts
// @access  Private (Student)
exports.submitAttempt = async (req, res, next) => {
  try {
    const { quizId, answers, timeSpentSeconds } = req.body;

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID is required'
      });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // answers can be an object { [questionId]: selectedOptionIndex } or array
    let answersMap = {};
    if (Array.isArray(answers)) {
      answers.forEach((ans) => {
        if (ans && ans.questionId) {
          answersMap[ans.questionId.toString()] = ans.selectedOption;
        }
      });
    } else if (answers && typeof answers === 'object') {
      answersMap = answers;
    }

    let totalMarks = 0;
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    const evaluatedAnswers = [];

    quiz.questions.forEach((question) => {
      const qIdStr = question._id.toString();
      const userSelected = answersMap[qIdStr] !== undefined ? Number(answersMap[qIdStr]) : -1;
      const qMarks = question.marks || 1;
      totalMarks += qMarks;

      let isCorrect = false;
      let marksAwarded = 0;

      if (userSelected === question.correctAnswer) {
        isCorrect = true;
        marksAwarded = qMarks;
        score += marksAwarded;
        correctAnswers += 1;
      } else if (userSelected === -1 || isNaN(userSelected)) {
        unanswered += 1;
      } else {
        wrongAnswers += 1;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        selectedOption: userSelected,
        correctOption: question.correctAnswer,
        isCorrect,
        marksAwarded,
        maxMarks: qMarks
      });
    });

    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 10000) / 100 : 0;
    const result = percentage >= quiz.passingPercentage ? 'PASS' : 'FAIL';

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      answers: evaluatedAnswers,
      score,
      totalMarks,
      percentage,
      correctAnswers,
      wrongAnswers,
      unanswered,
      result,
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      attemptedAt: new Date()
    });

    const populatedAttempt = await QuizAttempt.findById(attempt._id)
      .populate('student', 'name email')
      .populate('quiz', 'title subject duration passingPercentage');

    res.status(201).json({
      success: true,
      message: 'Quiz evaluated and submitted successfully',
      attempt: populatedAttempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attempts by the current logged-in student
// @route   GET /api/attempts/my-results
// @access  Private (Student)
exports.getMyResults = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate('quiz', 'title subject duration passingPercentage')
      .sort({ attemptedAt: -1 });

    const totalAttempts = attempts.length;
    let avgScore = 0;
    let highestScore = 0;
    let passCount = 0;

    if (totalAttempts > 0) {
      const sumPercentage = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
      avgScore = Math.round((sumPercentage / totalAttempts) * 10) / 10;
      highestScore = Math.max(...attempts.map((a) => a.percentage));
      passCount = attempts.filter((a) => a.result === 'PASS').length;
    }

    const passPercentage =
      totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 1000) / 10 : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalAttempts,
        avgScore,
        highestScore,
        passPercentage,
        passCount,
        failCount: totalAttempts - passCount
      },
      attempts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed attempt result by attempt ID
// @route   GET /api/attempts/:id
// @access  Private
exports.getAttemptById = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id)
      .populate('student', 'name email')
      .populate('quiz', 'title subject duration passingPercentage');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    // Check authorization: Must be the student who took it OR a teacher
    const isStudentOwner = attempt.student._id.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher';

    if (!isStudentOwner && !isTeacher) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this result'
      });
    }

    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    next(error);
  }
};
