import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableQuizzes from './pages/student/AvailableQuizzes';
import QuizAttempt from './pages/student/QuizAttempt';
import ResultPage from './pages/student/ResultPage';
import MyResults from './pages/student/MyResults';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateQuiz from './pages/teacher/CreateQuiz';
import EditQuiz from './pages/teacher/EditQuiz';
import ManageQuizzes from './pages/teacher/ManageQuizzes';
import StudentResults from './pages/teacher/StudentResults';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Shared Protected Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Student Protected Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/quizzes"
        element={
          <ProtectedRoute allowedRole="student">
            <AvailableQuizzes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/quiz/:id"
        element={
          <ProtectedRoute allowedRole="student">
            <QuizAttempt />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/result/:id"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-results"
        element={
          <ProtectedRoute allowedRole="student">
            <MyResults />
          </ProtectedRoute>
        }
      />

      {/* Teacher Protected Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/create-quiz"
        element={
          <ProtectedRoute allowedRole="teacher">
            <CreateQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/edit-quiz/:id"
        element={
          <ProtectedRoute allowedRole="teacher">
            <EditQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/manage-quizzes"
        element={
          <ProtectedRoute allowedRole="teacher">
            <ManageQuizzes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/student-results"
        element={
          <ProtectedRoute allowedRole="teacher">
            <StudentResults />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
