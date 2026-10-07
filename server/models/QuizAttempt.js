const mongoose = require('mongoose');

const answerRecordSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{ type: String, required: true }],
  selectedOption: {
    type: Number,
    default: -1 // -1 means unanswered
  },
  correctOption: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  marksAwarded: {
    type: Number,
    required: true,
    default: 0
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 1
  }
});

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    answers: [answerRecordSchema],
    score: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    wrongAnswers: {
      type: Number,
      required: true
    },
    unanswered: {
      type: Number,
      default: 0
    },
    result: {
      type: String,
      enum: ['PASS', 'FAIL'],
      required: true
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
