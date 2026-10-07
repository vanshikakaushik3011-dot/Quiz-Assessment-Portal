import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { attemptService } from '../../services/attemptService';
import Modal from '../../components/Modal';
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autoSubmittedNotice, setAutoSubmittedNotice] = useState(false);

  const timerRef = useRef(null);
  const answersRef = useRef(answers);
  const timeSpentRef = useRef(0);

  // Keep refs in sync for timer callback closure
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    timeSpentRef.current = timeSpentSeconds;
  }, [timeSpentSeconds]);

  // Load Quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(id);
        if (data.quiz) {
          setQuiz(data.quiz);
          const initialSeconds = data.quiz.duration * 60;
          setTimeLeft(initialSeconds);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
        alert('Failed to load assessment. Returning to dashboard.');
        navigate('/student/quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id, navigate]);

  // Timer Countdown
  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prevTime - 1;
      });

      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz]);

  const handleAutoSubmit = async () => {
    setAutoSubmittedNotice(true);
    await executeSubmission(true);
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const executeSubmission = async (isAuto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const payload = {
        quizId: quiz._id,
        answers: answersRef.current,
        timeSpentSeconds: timeSpentRef.current
      };

      const res = await attemptService.submitAttempt(payload);

      if (res.success && res.attempt) {
        navigate(`/student/result/${res.attempt._id}`, {
          state: { autoSubmitted: isAuto }
        });
      }
    } catch (err) {
      console.error('Error submitting quiz attempt:', err);
      alert('Error evaluating assessment. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 text-sm font-semibold">Preparing your quiz session...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 120; // less than 2 minutes

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Floating Quiz Navigation & Timer Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate pr-4">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
              {quiz.subject}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-slate-800 truncate">{quiz.title}</h1>
          </div>

          {/* Live Timer Clock */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
                isLowTime
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}
            >
              <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-600' : 'text-indigo-600'}`} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="hidden sm:inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-200 h-1">
          <div
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Quiz Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Active Question Area (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                Marks: {currentQuestion.marks || 1}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-xl font-bold text-slate-900 mb-8 leading-relaxed">
              {currentQuestion.questionText}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = answers[currentQuestion._id] === optIdx;
                const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestion._id, optIdx)}
                    className={`flex items-center p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs mr-4 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span className="text-sm sm:text-base font-medium flex-1">{option}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" />
              <span>Previous</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-all"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="inline-flex items-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-all"
              >
                <Send className="w-4 h-4 mr-1.5" />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Navigation Palette (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Questions Palette
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 mb-6">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
                <span>Remaining ({unansweredCount})</span>
              </div>
            </div>

            {/* Grid of numbers */}
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, idx) => {
                const isAnswered = answers[q._id] !== undefined;
                const isCurrent = currentIndex === idx;

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-600 ring-offset-2'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 sm:hidden">
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-3 bg-indigo-600 text-white font-semibold text-sm rounded-xl"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Submission Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Assessment Submission"
        confirmText="Confirm & Submit"
        cancelText="Review Questions"
        onConfirm={() => {
          setShowConfirmModal(false);
          executeSubmission(false);
        }}
        loading={isSubmitting}
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to finish and submit your quiz attempt?
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Total Questions:</span>
              <strong className="font-bold">{totalQuestions}</strong>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Answered:</span>
              <span>{answeredCount}</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Unanswered / Skipped:</span>
                <span>{unansweredCount}</span>
              </div>
            )}
          </div>

          {unansweredCount > 0 && (
            <p className="text-xs text-amber-600 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
              You have unanswered questions. Unanswered questions receive 0 marks.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default QuizAttempt;
