import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap { success, data } envelope & handle errors
axiosClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Backend returns { success: true, data: ..., message: ... }
    // Auto-unwrap so callers receive the final data value directly
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      return body.data;
    }
    return body;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    // If 401 Unauthorized, token might be expired or invalid
    if (error.response?.status === 401) {
      // If needed, can trigger an event or clear invalid auth
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
