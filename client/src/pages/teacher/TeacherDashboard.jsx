import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import { attemptService } from '../../services/attemptService';
import { quizService } from '../../services/quizService';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalStudents: 0,
    totalAttempts: 0,
    avgScore: 0,
    passRate: 0,
    recentAttempts: []
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const [statsRes, quizzesRes] = await Promise.all([
          attemptService.getTeacherStatistics(),
          quizService.getQuizzes()
        ]);

        if (statsRes.stats) {
          setStats(statsRes.stats);
        }
        if (quizzesRes.quizzes) {
          // Filter teacher's own quizzes
          setQuizzes(quizzesRes.quizzes.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load teacher stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Instructor Management Console</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {user?.name}! 🎓
              </h1>
              <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
                Design academic assessments, monitor student performance across subjects, and evaluate
                real-time examination metrics.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/teacher/create-quiz"
                  className="inline-flex items-center px-5 py-2.5 bg-white text-indigo-800 hover:bg-indigo-50 font-semibold rounded-xl text-sm shadow-xs transition-all hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Create New Assessment</span>
                </Link>
                <Link
                  to="/teacher/student-results"
                  className="inline-flex items-center px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-sm border border-white/20 transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span>View All Student Submissions</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Quizzes Created"
              value={stats.totalQuizzes}
              icon={BookOpen}
              color="indigo"
              subtitle="Active curriculum assessments"
            />
            <StatCard
              title="Active Students"
              value={stats.totalStudents || stats.totalRegisteredStudents || 0}
              icon={Users}
              color="purple"
              subtitle="Learners who submitted tests"
            />
            <StatCard
              title="Total Submissions"
              value={stats.totalAttempts}
              icon={Award}
              color="emerald"
              subtitle="Completed test submissions"
            />
            <StatCard
              title="Average Class Score"
              value={`${stats.avgScore}%`}
              icon={TrendingUp}
              color="amber"
              subtitle={`Class pass rate: ${stats.passRate || 0}%`}
            />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Submissions (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Latest Student Submissions</h3>
                  <p className="text-xs text-slate-500">Live feed of student test submissions</p>
                </div>
                <Link
                  to="/teacher/student-results"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <span>View full results table</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              {stats.recentAttempts && stats.recentAttempts.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3.5">Student</th>
                          <th className="px-5 py-3.5">Assessment</th>
                          <th className="px-5 py-3.5">Score</th>
                          <th className="px-5 py-3.5">Percentage</th>
                          <th className="px-5 py-3.5">Result</th>
                          <th className="px-5 py-3.5 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {stats.recentAttempts.map((attempt) => (
                          <tr key={attempt._id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-4 font-semibold text-slate-800">
                              {attempt.student?.name || 'Student'}
                              <span className="block text-xs font-normal text-slate-400">
                                {attempt.student?.email}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-700">
                              {attempt.quiz?.title || 'Quiz'}
                            </td>
                            <td className="px-5 py-4 font-medium text-slate-800 whitespace-nowrap">
                              {attempt.score} / {attempt.totalMarks}
                            </td>
                            <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
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
                            <td className="px-5 py-4 text-right text-xs text-slate-500 whitespace-nowrap">
                              {new Date(attempt.attemptedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No submissions yet</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Student test results will appear here as soon as they complete quizzes.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Quizzes Overview (1 col) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Assessments</h3>
                  <p className="text-xs text-slate-500">Quick management</p>
                </div>
                <Link
                  to="/teacher/manage-quizzes"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="space-y-3">
                {quizzes.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {q.subject}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {q.duration}m
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{q.title}</h4>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>{q.questionCount} Questions</span>
                      <Link
                        to={`/teacher/edit-quiz/${q._id}`}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Edit Quiz
                      </Link>
                    </div>
                  </div>
                ))}

                <Link
                  to="/teacher/create-quiz"
                  className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl text-slate-600 hover:text-indigo-600 text-xs font-semibold transition-all group"
                >
                  <PlusCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Create Another Assessment</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
