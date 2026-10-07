import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { quizService } from '../../services/quizService';
import {
  FileQuestion,
  Clock,
  Award,
  Search,
  BookOpen,
  User,
  Filter,
  ArrowRight,
  Loader2
} from 'lucide-react';

const AvailableQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzes({
        search: searchTerm,
        subject: selectedSubject !== 'All' ? selectedSubject : undefined
      });
      if (data.quizzes) {
        setQuizzes(data.quizzes);
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedSubject]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuizzes();
  };

  // Distinct subjects for filter
  const subjects = ['All', 'Web Technologies', 'Computer Science', 'Information Technology'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Available Assessments
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Select a quiz to test your mastery and earn verifiable results.
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search quizzes..."
                  className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white w-full sm:w-64"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </form>

              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quizzes List */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
              <p className="text-sm text-slate-500 font-medium">Loading assessments catalog...</p>
            </div>
          ) : quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all group"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full border border-indigo-100">
                        {quiz.subject}
                      </span>
                      <span className="flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-600" />
                        {quiz.duration} mins
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                      {quiz.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  {/* Metadata & Start Button */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Questions:</span>
                        <strong className="text-slate-800 font-semibold">
                          {quiz.questionCount} MCQs
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Total Marks:</span>
                        <strong className="text-slate-800 font-semibold">{quiz.totalMarks} pts</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Passing Mark:</span>
                        <strong className="text-slate-800 font-semibold">
                          {quiz.passingPercentage}%
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Instructor:</span>
                        <strong className="text-slate-800 font-semibold truncate block">
                          {quiz.createdBy?.name || 'Faculty Member'}
                        </strong>
                      </div>
                    </div>

                    <Link
                      to={`/student/quiz/${quiz._id}`}
                      className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all group-hover:shadow-md"
                    >
                      <span>Start Quiz</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No quizzes match your filter</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching with different terms or reset your subject category filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('All');
                }}
                className="mt-5 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AvailableQuizzes;
