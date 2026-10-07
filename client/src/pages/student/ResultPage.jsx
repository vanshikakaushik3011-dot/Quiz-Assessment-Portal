import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  LayoutDashboard,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles
} from 'lucide-react';

const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  const autoSubmitted = location.state?.autoSubmitted;

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const data = await attemptService.getAttemptById(id);
        if (data.attempt) {
          setAttempt(data.attempt);
        }
      } catch (err) {
        console.error('Failed to load attempt result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 text-sm font-semibold">Generating your evaluation report...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <XCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Result Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">This attempt record could not be loaded.</p>
          <Link
            to="/student/dashboard"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isPass = attempt.result === 'PASS';
  const totalQuestions = attempt.answers ? attempt.answers.length : 0;
  const timeFormatted = `${Math.floor(attempt.timeSpentSeconds / 60)}m ${attempt.timeSpentSeconds % 60}s`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            to="/student/my-results"
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to My Results</span>
          </Link>
          <span className="text-xs text-slate-400">
            Submission Date: {new Date(attempt.attemptedAt).toLocaleString()}
          </span>
        </div>

        {/* Auto submitted alert if triggered by timer */}
        {autoSubmitted && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs sm:text-sm font-medium flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-600 flex-shrink-0" />
            Time expired! Your assessment was automatically submitted and evaluated by the server.
          </div>
        )}

        {/* Performance Summary Banner */}
        <div
          className={`rounded-3xl p-6 sm:p-10 border shadow-md relative overflow-hidden ${
            isPass
              ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500'
              : 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-500'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wider uppercase mb-3">
                {isPass ? <Sparkles className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>Assessment Outcome</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {isPass ? 'Congratulations! You Passed! 🎉' : 'Assessment Not Cleared'}
              </h1>
              <p className="mt-2 text-white/90 text-sm sm:text-base font-normal max-w-xl">
                {isPass
                  ? `You achieved ${attempt.percentage}%, exceeding the required passing benchmark of ${attempt.quiz?.passingPercentage}%.`
                  : `You scored ${attempt.percentage}%. The minimum passing benchmark for this quiz is ${attempt.quiz?.passingPercentage}%. Review your answers below and try again.`}
              </p>
              <div className="mt-4 text-xs text-white/80">
                <span>Student: <strong>{attempt.student?.name}</strong></span> •{' '}
                <span>Quiz: <strong>{attempt.quiz?.title}</strong></span>
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20 sm:w-44 text-center">
              <span className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                {attempt.percentage}%
              </span>
              <span className="text-xs uppercase tracking-widest font-bold mt-1 text-white/90">
                {attempt.result}
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Final Score
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {attempt.score} <span className="text-sm font-normal text-slate-400">/ {attempt.totalMarks}</span>
            </div>
            <span className="text-[11px] text-slate-400">Total marks obtained</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
              Correct Answers
            </span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700">
              {attempt.correctAnswers} <span className="text-sm font-normal text-slate-400">/ {totalQuestions}</span>
            </div>
            <span className="text-[11px] text-emerald-600/80">Questions answered correctly</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block mb-1">
              Wrong / Skipped
            </span>
            <div className="text-xl sm:text-2xl font-bold text-rose-700">
              {attempt.wrongAnswers + (attempt.unanswered || 0)} <span className="text-sm font-normal text-slate-400">/ {totalQuestions}</span>
            </div>
            <span className="text-[11px] text-rose-600/80">
              {attempt.wrongAnswers} wrong • {attempt.unanswered || 0} skipped
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Time Taken
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {timeFormatted}
            </div>
            <span className="text-[11px] text-slate-400">Total session duration</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex gap-3">
            <Link
              to={`/student/quiz/${attempt.quiz?._id}`}
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Retake Quiz</span>
            </Link>
            <Link
              to="/student/dashboard"
              className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold transition-colors"
          >
            <span>{showDetails ? 'Hide Answer Review' : 'View Detailed Answers'}</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4 ml-1.5" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1.5" />
            )}
          </button>
        </div>

        {/* Detailed Question Review Section */}
        {showDetails && (
          <div className="space-y-6 pt-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Question-by-Question Evaluation</h3>
              <p className="text-xs text-slate-500">
                Detailed server-verified answer breakdown for each question in this assessment.
              </p>
            </div>

            <div className="space-y-4">
              {attempt.answers?.map((ans, idx) => {
                const isCorrect = ans.isCorrect;
                const isSkipped = ans.selectedOption === -1 || ans.selectedOption === undefined;

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
                      isCorrect
                        ? 'border-emerald-200'
                        : isSkipped
                        ? 'border-amber-200'
                        : 'border-rose-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Question {idx + 1}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {ans.marksAwarded} / {ans.maxMarks} marks
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : isSkipped
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1" /> Correct
                            </>
                          ) : isSkipped ? (
                            'Skipped'
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5 mr-1" /> Incorrect
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Question Text */}
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
                      {ans.questionText}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2">
                      {ans.options?.map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx);
                        const isStudentChoice = ans.selectedOption === optIdx;
                        const isCorrectChoice = ans.correctOption === optIdx;

                        let optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-700';

                        if (isCorrectChoice) {
                          optionStyle =
                            'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                        } else if (isStudentChoice && !isCorrect) {
                          optionStyle =
                            'border-rose-400 bg-rose-50/70 text-rose-900 font-semibold ring-1 ring-rose-400';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm ${optionStyle}`}
                          >
                            <div className="flex items-center space-x-3">
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  isCorrectChoice
                                    ? 'bg-emerald-600 text-white'
                                    : isStudentChoice
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {optLetter}
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              {isCorrectChoice && (
                                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                                  Correct Answer
                                </span>
                              )}
                              {isStudentChoice && (
                                <span
                                  className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                                    isCorrect
                                      ? 'bg-emerald-200 text-emerald-900'
                                      : 'bg-rose-200 text-rose-900'
                                  }`}
                                >
                                  Your Choice
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ResultPage;
