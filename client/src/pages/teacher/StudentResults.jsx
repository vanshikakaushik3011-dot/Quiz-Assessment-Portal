import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import { attemptService } from '../../services/attemptService';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Check,
  X
} from 'lucide-react';

const StudentResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [resultFilter, setResultFilter] = useState('All');

  // Breakdown Modal state
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {};
      if (studentSearch) params.student = studentSearch;
      if (quizSearch) params.quiz = quizSearch;
      if (subjectFilter !== 'All') params.subject = subjectFilter;
      if (resultFilter !== 'All') params.result = resultFilter;

      const data = await attemptService.getTeacherResults(params);
      if (data.attempts) {
        setAttempts(data.attempts);
      }
    } catch (err) {
      console.error('Failed to load student results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [subjectFilter, resultFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const subjects = ['All', 'Web Technologies', 'Computer Science', 'Information Technology'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Assessment Submissions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Analyze examination scores, track individual student performance, and view question
              response evaluations.
            </p>
          </div>

          {/* Filtering & Search Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Filter Records
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Student Search */}
              <div className="relative">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Student name or email..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Quiz Search */}
              <div className="relative">
                <input
                  type="text"
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  placeholder="Quiz title..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Subject Filter */}
              <div className="flex items-center space-x-2 border border-slate-300 rounded-xl px-3 py-2 bg-slate-50/50">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-700 cursor-pointer"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      Subject: {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Result Status Filter */}
              <div className="flex items-center space-x-2 border border-slate-300 rounded-xl px-3 py-2 bg-slate-50/50">
                <select
                  value={resultFilter}
                  onChange={(e) => setResultFilter(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-700 cursor-pointer"
                >
                  <option value="All">All Results</option>
                  <option value="PASS">PASS only</option>
                  <option value="FAIL">FAIL only</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStudentSearch('');
                    setQuizSearch('');
                    setSubjectFilter('All');
                    setResultFilter('All');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Student Attempts</h3>
              <span className="text-xs text-slate-500 font-medium">
                {attempts.length} submission{attempts.length === 1 ? '' : 's'} found
              </span>
            </div>

            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <p className="text-xs text-slate-500">Loading student attempts...</p>
              </div>
            ) : attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Assessment Title</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Percentage</th>
                      <th className="px-6 py-4">Result</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.map((attempt) => (
                      <tr key={attempt._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">
                            {attempt.student?.name || 'Student'}
                          </div>
                          <div className="text-xs text-slate-400">{attempt.student?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          <span className="font-medium text-slate-800">{attempt.quiz?.title}</span>
                          <span className="block text-xs text-slate-400">
                            {attempt.quiz?.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                          {attempt.score} / {attempt.totalMarks}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
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
                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(attempt.attemptedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedAttempt(attempt)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Breakdown</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No student submissions match</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting filters.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Attempt Breakdown Modal */}
      <Modal
        isOpen={!!selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
        title={`Submission Evaluation: ${selectedAttempt?.student?.name || 'Student'}`}
        cancelText="Close"
      >
        {selectedAttempt && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
              <div><strong>Assessment:</strong> {selectedAttempt.quiz?.title}</div>
              <div><strong>Student Email:</strong> {selectedAttempt.student?.email}</div>
              <div>
                <strong>Final Result:</strong>{' '}
                <span className={selectedAttempt.result === 'PASS' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                  {selectedAttempt.result} ({selectedAttempt.percentage}%)
                </span>
              </div>
              <div>
                <strong>Marks Awarded:</strong> {selectedAttempt.score} / {selectedAttempt.totalMarks}
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pt-2">
              Question Responses:
            </h4>

            <div className="space-y-3">
              {selectedAttempt.answers?.map((ans, idx) => {
                const isCorrect = ans.isCorrect;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Q{idx + 1}. {ans.questionText}</span>
                      <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {ans.marksAwarded} / {ans.maxMarks} marks
                      </span>
                    </div>

                    <div className="space-y-1 pl-2">
                      {ans.options?.map((opt, optIdx) => {
                        const isStudentChoice = ans.selectedOption === optIdx;
                        const isCorrectKey = ans.correctOption === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center space-x-2 p-1.5 rounded-lg ${
                              isCorrectKey
                                ? 'bg-emerald-100 text-emerald-900 font-semibold'
                                : isStudentChoice && !isCorrect
                                ? 'bg-rose-100 text-rose-900 font-semibold'
                                : 'text-slate-600'
                            }`}
                          >
                            <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                            {isCorrectKey && (
                              <span className="ml-auto text-[10px] uppercase font-bold text-emerald-700 flex items-center">
                                <Check className="w-3 h-3 mr-0.5" /> Correct Answer
                              </span>
                            )}
                            {isStudentChoice && !isCorrect && (
                              <span className="ml-auto text-[10px] uppercase font-bold text-rose-700 flex items-center">
                                <X className="w-3 h-3 mr-0.5" /> Student Pick
                              </span>
                            )}
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
      </Modal>

      <Footer />
    </div>
  );
};

export default StudentResults;
