import axiosClient from './axiosClient';

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      return response;
    } catch (err) {
      // Fallback for standalone demo / offline testing
      if (err.message.includes('Network Error') || err.message.includes('Failed to fetch') || err.message.includes('ECONNREFUSED')) {
        if (email === 'admin@ecommerce.com' && password === 'admin123') {
          return {
            success: true,
            message: 'Login successful (Offline Demo Mode)',
            data: {
              _id: '651a00000000000000000001',
              name: 'Admin User',
              email: 'admin@ecommerce.com',
              isAdmin: true,
              token: 'demo-jwt-admin-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            },
          };
        }
        if (email === 'demo@ecommerce.com' && password === 'demo123') {
          return {
            success: true,
            message: 'Login successful (Offline Demo Mode)',
            data: {
              _id: '651a2b3c4d5e6f7a8b9c0d1e',
              name: 'Alex Mercer',
              email: 'demo@ecommerce.com',
              isAdmin: false,
              token: 'demo-jwt-customer-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            },
          };
        }
        throw new Error('Invalid email or password');
      }
      throw err;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      return response;
    } catch (err) {
      if (err.message.includes('Network Error') || err.message.includes('Failed to fetch') || err.message.includes('ECONNREFUSED')) {
        return {
          success: true,
          message: 'User registered successfully (Offline Demo Mode)',
          data: {
            _id: '651a' + Math.random().toString(16).substring(2, 10),
            name: userData.name,
            email: userData.email,
            isAdmin: false,
            token: 'demo-jwt-reg-token-' + Date.now(),
          },
        };
      }
      throw err;
    }
  },
};
