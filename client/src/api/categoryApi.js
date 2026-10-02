import axiosClient from './axiosClient';
import { INITIAL_CATEGORIES } from './mockData';

export const categoryApi = {
  getCategories: async () => {
    try {
      const response = await axiosClient.get('/categories');
      return response.data || response;
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
