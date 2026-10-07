import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  FileQuestion,
  Award,
  PlusCircle,
  FolderKanban,
  Users
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isTeacher, isStudent } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-700 bg-clip-text text-transparent">
                  Quiz & Assessment
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 -mt-1">
                  Academic Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'text-indigo-600 bg-indigo-50 font-semibold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="/#features"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                >
                  Features
                </a>
                <a
                  href="/#about"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                >
                  About
                </a>
                <div className="h-5 w-[1px] bg-slate-200 mx-2" />
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="ml-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {isStudent && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/dashboard')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/student/quizzes"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/quizzes')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <FileQuestion className="w-4 h-4" />
                      <span>Available Quizzes</span>
                    </Link>
                    <Link
                      to="/student/my-results"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/my-results')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>My Results</span>
                    </Link>
                  </>
                )}

                {isTeacher && (
                  <>
                    <Link
                      to="/teacher/dashboard"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/teacher/dashboard')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/teacher/create-quiz"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/teacher/create-quiz')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create Quiz</span>
                    </Link>
                    <Link
                      to="/teacher/manage-quizzes"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/teacher/manage-quizzes')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <FolderKanban className="w-4 h-4" />
                      <span>Manage Quizzes</span>
                    </Link>
                    <Link
                      to="/teacher/student-results"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/teacher/student-results')
                          ? 'text-indigo-600 bg-indigo-50 font-semibold'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Student Results</span>
                    </Link>
                  </>
                )}

                {/* User menu */}
                <div className="h-6 w-[1px] bg-slate-200 mx-2" />
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {user?.name}
                      </div>
                      <div className="text-[10px] capitalize text-indigo-600 font-semibold tracking-wide">
                        {user?.role}
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Home
              </Link>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Features
              </a>
              <a
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                About
              </a>
              <div className="pt-2 border-t border-slate-200 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-2 bg-indigo-50 rounded-lg flex items-center space-x-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                  <div className="text-xs text-indigo-700 font-semibold capitalize">
                    {user?.role} • {user?.email}
                  </div>
                </div>
              </div>

              {isStudent && (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
                  >
                    <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/student/quizzes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
                  >
                    <FileQuestion className="w-5 h-5 text-indigo-600" />
                    <span>Available Quizzes</span>
                  </Link>
                  <Link
                    to="/student/my-results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
                  >
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>My Results</span>
                  </Link>
                </>
              )}

              {isTeacher && (
                <>
                  <Link
                    to="/teacher/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
                  >
                    <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/teacher/create-quiz"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
                  >
                    <PlusCircle className="w-5 h-5 text-indigo-600" />
                    <span>Create Quiz</span>
                  </Link>
                  <Link
                    to="/teacher/manage-quizzes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
                  >
                    <FolderKanban className="w-5 h-5 text-indigo-600" />
                    <span>Manage Quizzes</span>
                  </Link>
                  <Link
                    to="/teacher/student-results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
                  >
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Student Results</span>
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50"
              >
                <User className="w-5 h-5 text-indigo-600" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-md font-medium text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
