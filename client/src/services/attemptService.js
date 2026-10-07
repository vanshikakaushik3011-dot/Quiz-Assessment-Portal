import api from './api';

export const attemptService = {
  // Submit a student quiz attempt for backend evaluation
  submitAttempt: async (attemptData) => {
    const response = await api.post('/attempts', attemptData);
    return response.data;
  },

  // Get all attempts by the current logged-in student
  getMyResults: async () => {
    const response = await api.get('/attempts/my-results');
    return response.data;
  },

  // Get specific attempt details by ID
  getAttemptById: async (id) => {
    const response = await api.get(`/attempts/${id}`);
    return response.data;
  },

  // Get teacher dashboard statistics
  getTeacherStatistics: async () => {
    const response = await api.get('/teacher/statistics');
    return response.data;
  },

  // Get all student results for teacher
  getTeacherResults: async (params = {}) => {
    const response = await api.get('/teacher/results', { params });
    return response.data;
  }
};
