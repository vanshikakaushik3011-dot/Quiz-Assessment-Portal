import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { quizService } from '../services/quizService';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  BarChart3,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
  Users
} from 'lucide-react';

const LandingPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch a sample of public quizzes for preview
    quizService
      .getQuizzes()
      .then((data) => {
        if (data.quizzes) {
          setQuizzes(data.quizzes.slice(0, 3));
        }
      })
      .catch((err) => console.log('Landing quizzes preview:', err));
  }, []);

  const features = [
    {
      title: 'Online Quizzes',
      description:
        'Interactive MCQs with live countdown timers, question navigation palettes, and auto-submission.',
      icon: Clock,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      title: 'Instant Results',
      description:
        'Instant server-side score verification, percentage calculation, and pass/fail determination.',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      title: 'Performance Tracking',
      description:
        'Comprehensive historical attempt logs, detailed answer breakdowns, and average score analytics.',
      icon: BarChart3,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    {
      title: 'Teacher Dashboard',
      description:
        'Complete overview of quiz submissions, student marks, subject filters, and participation stats.',
      icon: Users,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Secure Authentication',
      description:
        'Bcrypt password encryption and robust role-based JWT authorization for students and teachers.',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      title: 'Assessment Management',
      description:
        'Intuitive interface for educators to dynamically construct, update, and manage exams.',
      icon: BookOpen,
      color: 'bg-violet-50 text-violet-600 border-violet-100'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Academic Testing Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
              Test Your Knowledge.{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Track Your Progress.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              A modern, full-stack academic assessment engine where students attempt interactive
              timed quizzes and teachers create, evaluate, and manage examinations with real-time analytics.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition-all"
              >
                Sign In to Portal
              </Link>
            </div>

            {/* Quick Demo Credentials Pill */}
            <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-xl mx-auto text-left text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <ShieldCheck className="w-4 h-4" /> Quick Demo Accounts (Pre-Seeded)
                </span>
                <span className="text-[11px] font-normal text-slate-400">Ready to test</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-indigo-900 block">Teacher / Faculty:</span>
                  <p>Email: <code className="text-indigo-600">teacher@portal.edu</code></p>
                  <p>Password: <code className="text-slate-800">Teacher@123</code></p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-indigo-900 block">Student:</span>
                  <p>Email: <code className="text-indigo-600">student1@portal.edu</code></p>
                  <p>Password: <code className="text-slate-800">Student@123</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Built For Academic Excellence
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Everything You Need in One Unified Portal
            </h3>
            <p className="mt-4 text-base text-slate-600">
              Powerful tools designed specifically for students to demonstrate their mastery and for
              instructors to manage assessments efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${feature.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample Quizzes Preview */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Curriculum
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Featured Assessments
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Sample assessments prepared by faculty across key disciplines.
              </p>
            </div>
            <Link
              to="/student/quizzes"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>View all available quizzes</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {quiz.subject}
                      </span>
                      <span className="flex items-center text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {quiz.duration} mins
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                      {quiz.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      <strong>{quiz.questionCount}</strong> Questions • Pass:{' '}
                      <strong>{quiz.passingPercentage}%</strong>
                    </span>
                    <Link
                      to={`/student/quizzes`}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Attempt
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-500 text-sm">
                Explore quizzes by logging into the student portal.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Academic Standard
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Empowering Continuous Learning & Structured Evaluation
              </h3>
              <p className="text-slate-600 text-base leading-relaxed mt-4">
                Designed to bridge classroom learning and rigorous digital evaluation. Students
                experience interactive examinations with immediate feedback, detailed answer
                reviews, and historical performance tracking.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    Tamper-proof server-side evaluation prevents unauthorized answer tampering.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    Real-time timer with automatic submit upon expiration ensures fair testing.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    Dynamic educator tools to author, configure, and publish quizzes with custom passing criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-tr from-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <h4 className="text-xl font-bold">Ready to assess or take a quiz?</h4>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Join thousands of learners and instructors. Get started now in just a few clicks.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm text-center shadow-md transition-all"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm text-center border border-slate-700 transition-all"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
