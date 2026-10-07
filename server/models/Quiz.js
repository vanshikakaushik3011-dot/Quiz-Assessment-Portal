const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'At least 2 options are required'],
    validate: {
      validator: function (val) {
        return Array.isArray(val) && val.length >= 2;
      },
      message: 'Question must have at least 2 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: [0, 'Answer index cannot be negative']
  },
  marks: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Marks per question must be at least 1']
  }
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [80, 'Subject cannot exceed 80 characters']
    },
    description: {
      type: String,
      required: [true, 'Quiz description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [300, 'Duration cannot exceed 300 minutes']
    },
    passingPercentage: {
      type: Number,
      required: [true, 'Passing percentage is required'],
      min: [1, 'Passing percentage must be at least 1%'],
      max: [100, 'Passing percentage cannot exceed 100%'],
      default: 50
    },
    questions: {
      type: [questionSchema],
      required: [true, 'At least one question is required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'A quiz must contain at least one question'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total marks
quizSchema.virtual('totalMarks').get(function () {
  if (!this.questions) return 0;
  return this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
});

// Virtual for total question count
quizSchema.virtual('totalQuestions').get(function () {
  return this.questions ? this.questions.length : 0;
});

module.exports = mongoose.model('Quiz', quizSchema);
