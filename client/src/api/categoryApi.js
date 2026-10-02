import axiosClient from './axiosClient';
import { INITIAL_CATEGORIES } from './mockData';

export const categoryApi = {
  getCategories: async () => {
    try {
      const data = await axiosClient.get('/categories');
      // axiosClient interceptor auto-unwraps { success, data } envelope
      return Array.isArray(data) ? data : [];
    } catch (err) {
      // Fallback for standalone demo mode
      const local = localStorage.getItem('demo_categories');
      if (local) {
        return JSON.parse(local);
      }
      return INITIAL_CATEGORIES;
    }
  },
};
