const User = require('../models/User');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get user profile with relevant role statistics
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let stats = {};

    if (user.role === 'student') {
      const attempts = await QuizAttempt.find({ student: user._id });
      const totalAttempts = attempts.length;
      const passedAttempts = attempts.filter((a) => a.result === 'PASS').length;
      const avgScore =
        totalAttempts > 0
          ? Math.round((attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts) * 10) / 10
          : 0;
      const highestScore =
        totalAttempts > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;

      stats = {
        totalAttempts,
        passedAttempts,
        avgScore,
        highestScore
      };
    } else if (user.role === 'teacher') {
      const quizzes = await Quiz.find({ createdBy: user._id });
      const quizIds = quizzes.map((q) => q._id);
      const attempts = await QuizAttempt.find({ quiz: { $in: quizIds } });

      const totalQuizzes = quizzes.length;
      const totalAttempts = attempts.length;
      const uniqueStudents = new Set(attempts.map((a) => a.student.toString())).size;
      const avgScore =
        totalAttempts > 0
          ? Math.round((attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts) * 10) / 10
          : 0;

      stats = {
        totalQuizzes,
        totalAttempts,
        uniqueStudents,
        avgScore
      };
    }

    res.status(200).json({
      success: true,
      user,
      stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) {
      user.name = name.trim();
    }

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your current password to set a new password'
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
