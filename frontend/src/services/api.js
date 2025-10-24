import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('token');

// API instance with auth header
const apiClient = axios.create({
  baseURL: API,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await axios.post(`${API}/auth/register`, data);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },
  
  login: async (data) => {
    const response = await axios.post(`${API}/auth/login`, data);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },
  
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },
  
  logout: () => {
    removeToken();
  }
};

// Courses API
export const coursesAPI = {
  getAll: async (params) => {
    const response = await axios.get(`${API}/courses`, { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API}/courses/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  }
};

// Enrollments API
export const enrollmentsAPI = {
  enroll: async (courseId) => {
    const response = await apiClient.post('/enrollments', { course_id: courseId });
    return response.data;
  },
  
  getMyCourses: async () => {
    const response = await apiClient.get('/enrollments/my-courses');
    return response.data;
  },
  
  updateProgress: async (enrollmentId, progress) => {
    const response = await apiClient.put(`/enrollments/${enrollmentId}/progress`, { progress });
    return response.data;
  }
};

// Stats API
export const statsAPI = {
  get: async () => {
    const response = await axios.get(`${API}/stats`);
    return response.data;
  },
  
  update: async (data) => {
    const response = await apiClient.put('/stats', data);
    return response.data;
  }
};

// Campuses API
export const campusesAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/campuses`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/campuses', data);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  }
};

export { getToken, setToken, removeToken };
