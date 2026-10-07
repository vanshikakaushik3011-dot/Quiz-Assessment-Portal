import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Lock,
  Save,
  CheckCircle2,
  Award,
  BookOpen,
  TrendingUp,
  Loader2
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser, isTeacher, isStudent } = useAuth();

  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await authService.getProfile();
        if (data.user) {
          setName(data.user.name);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setToast({ type: '', message: '' });

    if (!name.trim()) {
      setToast({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setToast({ type: 'error', message: 'New password must be at least 6 characters long.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setToast({ type: 'error', message: 'New passwords do not match.' });
        return;
      }
      if (!currentPassword) {
        setToast({
          type: 'error',
          message: 'Please provide your current password to authorize password change.'
        });
        return;
      }
    }

    try {
      setSaving(true);
      const payload = { name: name.trim() };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authService.updateProfile(payload);
      if (res.success) {
        updateUser(res.user);
        setToast({ type: 'success', message: 'Profile updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Update error:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Profile & Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your personal information, role credentials, and security settings.
            </p>
          </div>

          {toast.message && (
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast({ type: '', message: '' })}
            />
          )}

          {/* Profile Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-indigo-100">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
                  <span className="flex items-center text-slate-600">
                    <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {user?.email}
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {user?.role} Account
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                {isStudent && (
                  <>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Attempted
                      </span>
                      <strong className="text-xl font-bold text-slate-900 block mt-0.5">
                        {stats.totalAttempts || 0}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Passed
                      </span>
                      <strong className="text-xl font-bold text-emerald-600 block mt-0.5">
                        {stats.passedAttempts || 0}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Average
                      </span>
                      <strong className="text-xl font-bold text-indigo-600 block mt-0.5">
                        {stats.avgScore || 0}%
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Highest
                      </span>
                      <strong className="text-xl font-bold text-amber-600 block mt-0.5">
                        {stats.highestScore || 0}%
                      </strong>
                    </div>
                  </>
                )}

                {isTeacher && (
                  <>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Quizzes Created
                      </span>
                      <strong className="text-xl font-bold text-slate-900 block mt-0.5">
                        {stats.totalQuizzes || 0}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Total Submissions
                      </span>
                      <strong className="text-xl font-bold text-indigo-600 block mt-0.5">
                        {stats.totalAttempts || 0}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Active Students
                      </span>
                      <strong className="text-xl font-bold text-emerald-600 block mt-0.5">
                        {stats.uniqueStudents || 0}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Class Average
                      </span>
                      <strong className="text-xl font-bold text-amber-600 block mt-0.5">
                        {stats.avgScore || 0}%
                      </strong>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 mb-6">
              Update Information
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address (Read Only)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Change Password (Leave blank to keep current)
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
