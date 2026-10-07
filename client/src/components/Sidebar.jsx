import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileQuestion,
  Award,
  User,
  PlusCircle,
  FolderKanban,
  Users,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, isTeacher, isStudent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Available Quizzes', path: '/student/quizzes', icon: FileQuestion },
    { name: 'My Results', path: '/student/my-results', icon: Award },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const teacherLinks = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Create Quiz', path: '/teacher/create-quiz', icon: PlusCircle },
    { name: 'Manage Quizzes', path: '/teacher/manage-quizzes', icon: FolderKanban },
    { name: 'Student Results', path: '/teacher/student-results', icon: Users },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const navLinks = isTeacher ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex lg:flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Role Tag */}
        <div className="px-3 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 truncate">{user?.name}</h4>
            <span className="inline-block px-2 py-0.5 text-[11px] font-semibold text-indigo-700 bg-white rounded-md shadow-xs border border-indigo-100 uppercase tracking-wider">
              {user?.role} Portal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-semibold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
