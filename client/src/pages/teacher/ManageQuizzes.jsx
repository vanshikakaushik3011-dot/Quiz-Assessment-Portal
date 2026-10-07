import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import { quizService } from '../../services/quizService';
import {
  FolderKanban,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Check
} from 'lucide-react';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Deletion modal state
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview modal state
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [toast, setToast] = useState({ type: '', message: '' });

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzes({
        search: searchTerm,
        subject: selectedSubject !== 'All' ? selectedSubject : undefined
      });
      if (data.quizzes) {
        setQuizzes(data.quizzes);
      }
    } catch (err) {
      console.error('Error fetching teacher quizzes:', err);
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

  // Open Preview Modal
  const handleOpenPreview = async (quizId) => {
    try {
      setPreviewLoading(true);
      const data = await quizService.getQuizById(quizId);
      if (data.quiz) {
        setPreviewQuiz(data.quiz);
      }
    } catch (err) {
      console.error('Error fetching quiz details:', err);
      setToast({ type: 'error', message: 'Could not load quiz preview.' });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;
    try {
      setIsDeleting(true);
      await quizService.deleteQuiz(quizToDelete._id);
      setToast({
        type: 'success',
        message: `Quiz "${quizToDelete.title}" and its records were deleted successfully.`
      });
      setQuizToDelete(null);
      fetchQuizzes();
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete quiz.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const subjects = ['All', 'Web Technologies', 'Computer Science', 'Information Technology'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Manage Assessments
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                View, modify, inspect, or remove curriculum quizzes.
              </p>
            </div>

            <Link
              to="/teacher/create-quiz"
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>Create New Quiz</span>
            </Link>
          </div>

          {toast.message && (
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast({ type: '', message: '' })}
            />
          )}

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or subject..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
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

          {/* Quizzes Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Curriculum Quizzes</h3>
              <span className="text-xs text-slate-500 font-medium">
                {quizzes.length} assessment{quizzes.length === 1 ? '' : 's'} available
              </span>
            </div>

            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <p className="text-xs text-slate-500">Loading assessments...</p>
              </div>
            ) : quizzes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Title & Subject</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Questions</th>
                      <th className="px-6 py-4">Total Marks</th>
                      <th className="px-6 py-4">Passing %</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quizzes.map((quiz) => (
                      <tr key={quiz._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{quiz.title}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {quiz.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                          {quiz.duration} mins
                        </td>
                        <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                          <strong>{quiz.questionCount}</strong> MCQs
                        </td>
                        <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                          {quiz.totalMarks} pts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800">{quiz.passingPercentage}%</span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenPreview(quiz._id)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Preview questions"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <Link
                              to={`/teacher/edit-quiz/${quiz._id}`}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit assessment"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => setQuizToDelete(quiz)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete assessment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No Assessments Found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Create a new quiz assessment to get started.
                </p>
                <Link
                  to="/teacher/create-quiz"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                  <span>Create First Quiz</span>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!quizToDelete}
        onClose={() => setQuizToDelete(null)}
        title="Confirm Assessment Deletion"
        confirmText="Yes, Delete Quiz"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      >
        <div className="space-y-3">
          <p className="text-slate-700">
            Are you sure you want to delete the quiz{' '}
            <strong className="text-slate-900">"{quizToDelete?.title}"</strong>?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>
              This will permanently delete this quiz and remove all historical student attempts associated with it. This action cannot be undone.
            </span>
          </div>
        </div>
      </Modal>

      {/* Question Details Preview Modal */}
      <Modal
        isOpen={!!previewQuiz}
        onClose={() => setPreviewQuiz(null)}
        title={previewQuiz?.title || 'Assessment Preview'}
        cancelText="Close Preview"
      >
        {previewQuiz && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-1">
              <div><strong>Subject:</strong> {previewQuiz.subject}</div>
              <div><strong>Duration:</strong> {previewQuiz.duration} minutes</div>
              <div><strong>Passing Mark:</strong> {previewQuiz.passingPercentage}%</div>
              <div><strong>Description:</strong> {previewQuiz.description}</div>
            </div>

            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pt-2">
              Question Breakdown ({previewQuiz.questions?.length} Questions):
            </h4>

            <div className="space-y-3">
              {previewQuiz.questions?.map((q, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Q{idx + 1}. {q.questionText}</span>
                    <span className="text-indigo-600">{q.marks || 1} mark(s)</span>
                  </div>
                  <div className="space-y-1 pl-2">
                    {q.options?.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`flex items-center space-x-1.5 p-1.5 rounded-lg ${
                          optIdx === q.correctAnswer
                            ? 'bg-emerald-100 text-emerald-900 font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                        {optIdx === q.correctAnswer && (
                          <span className="ml-auto text-[10px] uppercase font-bold text-emerald-700 flex items-center">
                            <Check className="w-3 h-3 mr-0.5" /> Correct Key
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default ManageQuizzes;
