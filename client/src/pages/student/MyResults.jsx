import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import { attemptService } from '../../services/attemptService';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  FileQuestion,
  Eye,
  Loader2,
  ArrowRight
} from 'lucide-react';

const MyResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    avgScore: 0,
    highestScore: 0,
    passPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await attemptService.getMyResults();
        if (data.attempts) {
          setAttempts(data.attempts);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Assessment Results
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review your historical scores, accuracy percentages, and comprehensive question
              breakdowns.
            </p>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Quizzes Attempted"
              value={stats.totalAttempts}
              icon={FileQuestion}
              color="indigo"
              subtitle="All time submissions"
            />
            <StatCard
              title="Average Score"
              value={`${stats.avgScore}%`}
              icon={TrendingUp}
              color="purple"
              subtitle="Overall grade average"
            />
            <StatCard
              title="Best Score"
              value={`${stats.highestScore}%`}
              icon={Award}
              color="emerald"
              subtitle="Highest percentage"
            />
            <StatCard
              title="Pass Percentage"
              value={`${stats.passPercentage}%`}
              icon={CheckCircle2}
              color="amber"
              subtitle="Exceeded passing mark"
            />
          </div>

          {/* Attempts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Attempt Records History</h3>
              <span className="text-xs text-slate-500">
                Total <strong>{attempts.length}</strong> attempts
              </span>
            </div>

            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <p className="text-xs text-slate-500">Loading your history records...</p>
              </div>
            ) : attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Quiz Name</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Percentage</th>
                      <th className="px-6 py-4">Result</th>
                      <th className="px-6 py-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.map((attempt) => (
                      <tr key={attempt._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {attempt.quiz?.title || 'Assessment'}
                          <span className="block text-xs font-normal text-slate-400">
                            {attempt.quiz?.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(attempt.attemptedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">
                          {attempt.score} / {attempt.totalMarks}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                          {attempt.percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Link
                            to={`/student/result/${attempt._id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No Assessment Records Found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Take an assessment to record your test scores and track your academic progress.
                </p>
                <Link
                  to="/student/quizzes"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
                >
                  <span>Explore Quizzes</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MyResults;
