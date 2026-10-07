const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get all quizzes (supports search & filter)
// @route   GET /api/quizzes
// @access  Public or Authenticated
exports.getQuizzes = async (req, res, next) => {
  try {
    const { search, subject } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    if (subject && subject !== 'All') {
      query.subject = { $regex: `^${subject}$`, $options: 'i' };
    }

    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Sanitize questions: strip correctAnswer for list view
    const formatted = quizzes.map((quiz) => {
      const qObj = quiz.toObject();
      return {
        _id: qObj._id,
        title: qObj.title,
        subject: qObj.subject,
        description: qObj.description,
        duration: qObj.duration,
        passingPercentage: qObj.passingPercentage,
        questionCount: qObj.questions ? qObj.questions.length : 0,
        totalMarks: qObj.questions
          ? qObj.questions.reduce((sum, q) => sum + (q.marks || 1), 0)
          : 0,
        createdBy: qObj.createdBy,
        createdAt: qObj.createdAt
      };
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      quizzes: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private / Public
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if requester is the teacher who created this quiz
    const isTeacherOwner =
      req.user &&
      req.user.role === 'teacher' &&
      quiz.createdBy &&
      quiz.createdBy._id.toString() === req.user._id.toString();

    const quizObj = quiz.toObject({ virtuals: true });

    // If not the teacher owner, strip the correct answer so students cannot peek
    if (!isTeacherOwner) {
      quizObj.questions = quizObj.questions.map((q) => {
        const { correctAnswer, ...safeQuestion } = q;
        return safeQuestion;
      });
    }

    res.status(200).json({
      success: true,
      quiz: quizObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher only)
exports.createQuiz = async (req, res, next) => {
  try {
    const { title, subject, description, duration, passingPercentage, questions } = req.body;

    if (!title || !subject || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, description, and duration'
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A quiz must contain at least one question'
      });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.questionText.trim()) {
        return res.status(400).json({
          success: false,
          message: `Question #${i + 1} text cannot be empty`
        });
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: `Question #${i + 1} must have at least 2 options`
        });
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j] || !q.options[j].trim()) {
          return res.status(400).json({
            success: false,
            message: `Question #${i + 1} option ${String.fromCharCode(65 + j)} cannot be empty`
          });
        }
      }
      if (
        typeof q.correctAnswer !== 'number' ||
        q.correctAnswer < 0 ||
        q.correctAnswer >= q.options.length
      ) {
        return res.status(400).json({
          success: false,
          message: `Question #${i + 1} has an invalid correct answer selected`
        });
      }
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      duration: Number(duration),
      passingPercentage: Number(passingPercentage) || 50,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Teacher only)
exports.updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Verify ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this quiz'
      });
    }

    const { title, subject, description, duration, passingPercentage, questions } = req.body;

    if (questions) {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'A quiz must contain at least one question'
        });
      }
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText || !q.questionText.trim()) {
          return res.status(400).json({
            success: false,
            message: `Question #${i + 1} text cannot be empty`
          });
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Question #${i + 1} must have at least 2 options`
          });
        }
        if (
          typeof q.correctAnswer !== 'number' ||
          q.correctAnswer < 0 ||
          q.correctAnswer >= q.options.length
        ) {
          return res.status(400).json({
            success: false,
            message: `Question #${i + 1} has an invalid correct answer selected`
          });
        }
      }
      quiz.questions = questions;
    }

    if (title) quiz.title = title.trim();
    if (subject) quiz.subject = subject.trim();
    if (description) quiz.description = description.trim();
    if (duration) quiz.duration = Number(duration);
    if (passingPercentage !== undefined) quiz.passingPercentage = Number(passingPercentage);

    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Teacher only)
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz'
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    // Optionally clean up attempts
    await QuizAttempt.deleteMany({ quiz: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Quiz and associated attempts deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
