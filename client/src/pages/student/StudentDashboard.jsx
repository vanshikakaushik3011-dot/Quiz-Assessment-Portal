import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import { attemptService } from '../../services/attemptService';
import { quizService } from '../../services/quizService';
import {
  Award,
  BarChart3,
  CheckCircle2,
  FileQuestion,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    avgScore: 0,
    highestScore: 0,
    passPercentage: 0
  });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resultsData, quizzesData] = await Promise.all([
          attemptService.getMyResults(),
          quizService.getQuizzes()
        ]);

        if (resultsData.stats) {
          setStats(resultsData.stats);
        }
        if (resultsData.attempts) {
          setRecentAttempts(resultsData.attempts.slice(0, 4));
        }
        if (quizzesData.quizzes) {
          setAvailableQuizzes(quizzesData.quizzes.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Student Learning Space</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
                Track your quiz progress, attempt new scheduled assessments, and analyze your
                score performance in real-time.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/student/quizzes"
                  className="inline-flex items-center px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-xl text-sm shadow-xs transition-all hover:scale-105"
                >
                  <FileQuestion className="w-4 h-4 mr-2" />
                  <span>Browse Quizzes</span>
                </Link>
                <Link
                  to="/student/my-results"
                  className="inline-flex items-center px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-sm border border-white/20 transition-colors"
                >
                  <Award className="w-4 h-4 mr-2" />
                  <span>View All Results</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Quizzes Attempted"
              value={stats.totalAttempts}
              icon={FileQuestion}
              color="indigo"
              subtitle="Total assessments submitted"
            />
            <StatCard
              title="Average Score"
              value={`${stats.avgScore}%`}
              icon={TrendingUp}
              color="purple"
              subtitle="Cumulative mean percentage"
            />
            <StatCard
              title="Highest Score"
              value={`${stats.highestScore}%`}
              icon={Award}
              color="emerald"
              subtitle="Best performance recorded"
            />
            <StatCard
              title="Pass Rate"
              value={`${stats.passPercentage}%`}
              icon={CheckCircle2}
              color="amber"
              subtitle="Assessments passed"
            />
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Attempts (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Quiz Attempts</h3>
                  <p className="text-xs text-slate-500">Your latest submitted tests</p>
                </div>
                <Link
                  to="/student/my-results"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              {recentAttempts.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3.5">Quiz Name</th>
                          <th className="px-5 py-3.5">Date</th>
                          <th className="px-5 py-3.5">Score</th>
                          <th className="px-5 py-3.5">Percentage</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentAttempts.map((attempt) => (
                          <tr key={attempt._id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-4 font-semibold text-slate-800">
                              {attempt.quiz?.title || 'Assessment'}
                              <span className="block text-xs font-normal text-slate-400">
                                {attempt.quiz?.subject}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                              {new Date(attempt.attemptedAt).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-4 text-slate-700 font-medium whitespace-nowrap">
                              {attempt.score} / {attempt.totalMarks}
                            </td>
                            <td className="px-5 py-4 font-bold text-slate-800 whitespace-nowrap">
                              {attempt.percentage}%
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  attempt.result === 'PASS'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {attempt.result}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              <Link
                                to={`/student/result/${attempt._id}`}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                              >
                                Review Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <FileQuestion className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No attempts yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You haven't attempted any quizzes yet. Explore the available quizzes catalog to test your skills!
                  </p>
                  <Link
                    to="/student/quizzes"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
                  >
                    Take a Quiz Now
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Available Quizzes (1 col) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Featured Quizzes</h3>
                  <p className="text-xs text-slate-500">Ready to attempt</p>
                </div>
                <Link
                  to="/student/quizzes"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="space-y-3">
                {availableQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {quiz.subject}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {quiz.duration}m
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{quiz.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {quiz.questionCount} Questions • {quiz.totalMarks} Marks
                      </span>
                      <Link
                        to={`/student/quiz/${quiz._id}`}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                      >
                        Start
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
