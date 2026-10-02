import axiosClient from './axiosClient';
import { INITIAL_CATEGORIES, getLocalStore, setLocalStore } from './mockData';

const STORAGE_KEY = 'mini_ecommerce_categories';

export const categoryApi = {
  getCategories: async () => {
    try {
      const response = await axiosClient.get('/categories');
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const categories = getLocalStore(STORAGE_KEY, INITIAL_CATEGORIES);
        return { success: true, data: categories };
      }
      throw new Error(err.response?.data?.message || 'Failed to fetch categories');
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await axiosClient.post('/categories', categoryData);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const categories = getLocalStore(STORAGE_KEY, INITIAL_CATEGORIES);
        const newCat = {
          _id: 'cat_' + Date.now(),
          name: categoryData.name,
          description: categoryData.description || '',
          createdAt: new Date().toISOString(),
        };
        const updated = [...categories, newCat];
        setLocalStore(STORAGE_KEY, updated);
        return { success: true, message: 'Category created successfully', data: newCat };
      }
      throw new Error(err.response?.data?.message || 'Failed to create category');
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await axiosClient.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const categories = getLocalStore(STORAGE_KEY, INITIAL_CATEGORIES);
        let updatedCat = null;
        const updated = categories.map((cat) => {
          if (cat._id === id) {
            updatedCat = { ...cat, ...categoryData };
            return updatedCat;
          }
          return cat;
        });
        setLocalStore(STORAGE_KEY, updated);
        return { success: true, message: 'Category updated successfully', data: updatedCat };
      }
      throw new Error(err.response?.data?.message || 'Failed to update category');
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await axiosClient.delete(`/categories/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const categories = getLocalStore(STORAGE_KEY, INITIAL_CATEGORIES);
        const updated = categories.filter((cat) => cat._id !== id);
        setLocalStore(STORAGE_KEY, updated);
        return { success: true, message: 'Category deleted successfully' };
      }
      throw new Error(err.response?.data?.message || 'Failed to delete category');
    }
  },
};
