import axiosClient from './axiosClient';
import { INITIAL_PRODUCTS } from './mockData';

export const productApi = {
  getProducts: async ({ category, search } = {}) => {
    try {
      const params = {};
      if (category && category !== 'All') {
        params.category = category;
      }
      if (search && search.trim() !== '') {
        params.search = search.trim();
      }
      const response = await axiosClient.get('/products', { params });
      return response.data || response;
    } catch (err) {
      // Fallback for standalone demo mode
      let products = [...INITIAL_PRODUCTS];
      const localProducts = localStorage.getItem('demo_products');
      if (localProducts) {
        products = JSON.parse(localProducts);
      }

      if (category && category !== 'All') {
        products = products.filter(
          (p) =>
            p.category?._id === category ||
            p.category?.name?.toLowerCase() === category.toLowerCase() ||
            p.category === category
        );
      }

      if (search && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      return products;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data || response;
    } catch (err) {
      let products = [...INITIAL_PRODUCTS];
      const localProducts = localStorage.getItem('demo_products');
      if (localProducts) {
        products = JSON.parse(localProducts);
      }
      const product = products.find((p) => p._id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    }
  },
};
