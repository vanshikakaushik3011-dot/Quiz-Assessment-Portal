import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { quizService } from '../../services/quizService';
import {
  PlusCircle,
  Trash2,
  Save,
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  FileCheck2,
  Clock,
  Layers
} from 'lucide-react';

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [customSubject, setCustomSubject] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(50);

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjectOptions = [
    'Computer Science',
    'Web Technologies',
    'Information Technology',
    'Data Structures & Algorithms',
    'Software Engineering',
    'Database Management',
    'Custom'
  ];

  // Add Question
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1
      }
    ]);
  };

  // Remove Question
  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) {
      setError('A quiz must contain at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setError('');
  };

  // Question Text Change
  const handleQuestionTextChange = (index, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index].questionText = value;
      return updated;
    });
  };

  // Option Change
  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const newOptions = [...updated[qIndex].options];
      newOptions[optIndex] = value;
      updated[qIndex].options = newOptions;
      return updated;
    });
  };

  // Correct Answer Change
  const handleCorrectAnswerChange = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].correctAnswer = optIndex;
      return updated;
    });
  };

  // Marks Change
  const handleMarksChange = (qIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].marks = Math.max(1, Number(value) || 1);
      return updated;
    });
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalSubject = subject === 'Custom' ? customSubject.trim() : subject;

    if (!title.trim() || !finalSubject || !description.trim()) {
      setError('Please provide title, subject, and description for the quiz.');
      return;
    }

    if (duration <= 0) {
      setError('Quiz duration must be greater than 0 minutes.');
      return;
    }

    if (passingPercentage < 1 || passingPercentage > 100) {
      setError('Passing percentage must be between 1% and 100%.');
      return;
    }

    // Validate Questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question #${i + 1} text cannot be empty.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(
            `Question #${i + 1} option ${String.fromCharCode(65 + j)} cannot be empty.`
          );
          return;
        }
      }
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        subject: finalSubject,
        description: description.trim(),
        duration: Number(duration),
        passingPercentage: Number(passingPercentage),
        questions
      };

      const res = await quizService.createQuiz(payload);
      if (res.success) {
        navigate('/teacher/manage-quizzes');
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(err.response?.data?.message || 'Failed to create assessment.');
    } finally {
      setLoading(false);
    }
  };

  const totalPossibleMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                to="/teacher/manage-quizzes"
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Back to Manage Quizzes</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create New Assessment
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Configure quiz parameters and add multiple-choice questions with answer keys.
              </p>
            </div>

            {/* Quick summary pill */}
            <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4 text-xs font-semibold">
              <span className="text-slate-600">
                Questions: <strong className="text-indigo-600">{questions.length}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">
                Total Marks: <strong className="text-emerald-600">{totalPossibleMarks}</strong>
              </span>
            </div>
          </div>

          {error && <Toast type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Assessment Details Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <span>Assessment Overview</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Advanced Operating Systems Mid-Term"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Subject Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Subject / Discipline *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    {subjectOptions.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  {subject === 'Custom' && (
                    <input
                      type="text"
                      required
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Type custom subject name..."
                      className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  )}
                </div>

                {/* Duration & Passing Percentage */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Duration (Mins) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="300"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Passing Score (%) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={passingPercentage}
                      onChange={(e) => setPassingPercentage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Description & Instructions *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide overview, instructions, topics covered, and guidelines for students..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Questions Builder Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Questions & Answer Keys</h2>
                  <p className="text-xs text-slate-500">
                    Add questions, options, select the correct answer key, and assign marks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  <span>Add Another Question</span>
                </button>
              </div>

              {questions.map((question, qIdx) => (
                <div
                  key={qIdx}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 relative"
                >
                  {/* Question header row */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                      Question #{qIdx + 1}
                    </span>

                    <div className="flex items-center space-x-3">
                      {/* Marks assigner */}
                      <div className="flex items-center space-x-2">
                        <label className="text-xs font-semibold text-slate-500">Marks:</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={question.marks}
                          onChange={(e) => handleMarksChange(qIdx, e.target.value)}
                          className="w-16 px-2.5 py-1 text-xs border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>

                      {/* Remove question button */}
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove this question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Question Text *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={question.questionText}
                      onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                      placeholder="Write your question statement clearly..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                    />
                  </div>

                  {/* Options (A, B, C, D) */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Multiple Choice Options & Correct Key *
                    </label>
                    <p className="text-[11px] text-slate-400 -mt-2 mb-2">
                      Click the radio circle next to the correct answer option.
                    </p>

                    {question.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = question.correctAnswer === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center space-x-3 p-2.5 sm:p-3 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-50/50'
                              : 'border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          {/* Radio button */}
                          <input
                            type="radio"
                            name={`correct-answer-${qIdx}`}
                            checked={isCorrect}
                            onChange={() => handleCorrectAnswerChange(qIdx, optIdx)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-1"
                          />

                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>

                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            placeholder={`Enter Option ${letter} text...`}
                            className="flex-1 bg-white px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          />

                          {isCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider hidden sm:inline-block pr-2">
                              Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Bottom Add Question Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center px-6 py-3 bg-white border-2 border-dashed border-indigo-300 hover:border-indigo-600 text-indigo-700 font-semibold rounded-2xl text-sm transition-all hover:bg-indigo-50"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  <span>Add Another Question</span>
                </button>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-200">
              <Link
                to="/teacher/manage-quizzes"
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                <span>{loading ? 'Publishing Assessment...' : 'Save & Publish Assessment'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreateQuiz;
