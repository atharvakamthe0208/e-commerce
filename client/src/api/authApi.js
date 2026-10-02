import axiosClient from './axiosClient';

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      // Offline / standalone demo fallback
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const adminEmail = 'admin@ecommerce.com';
        const demoEmail = 'demo@ecommerce.com';

        if (email === adminEmail && password === 'admin123') {
          const data = {
            _id: '651a11111111111111111111',
            name: 'Admin User',
            email: adminEmail,
            isAdmin: true,
            token: 'mock-jwt-admin-token-' + Date.now(),
          };
          return { success: true, message: 'Login successful (Demo Mode)', data };
        } else if (email === demoEmail && password === 'demo123') {
          const data = {
            _id: '651a2b3c4d5e6f7a8b9c0d1e',
            name: 'Alex Mercer',
            email: demoEmail,
            isAdmin: false,
            token: 'mock-jwt-customer-token-' + Date.now(),
          };
          return { success: true, message: 'Login successful (Demo Mode)', data };
        } else {
          throw new Error('Invalid email or password. Use demo credentials from guide.');
        }
      }
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        if (userData.password !== userData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (userData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        const data = {
          _id: 'user_' + Date.now(),
          name: userData.name,
          email: userData.email,
          isAdmin: false,
          token: 'mock-jwt-registered-token-' + Date.now(),
        };
        return { success: true, message: 'User registered successfully (Demo Mode)', data };
      }
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },
};
