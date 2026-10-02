import axiosClient from './axiosClient';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, getLocalStore, setLocalStore } from './mockData';

const STORAGE_KEY = 'mini_ecommerce_products';
const CAT_STORAGE_KEY = 'mini_ecommerce_categories';

export const productApi = {
  getProducts: async (params = {}) => {
    try {
      const response = await axiosClient.get('/products', { params });
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        let products = getLocalStore(STORAGE_KEY, INITIAL_PRODUCTS);

        // Filter by category
        if (params.category && params.category !== 'all') {
          products = products.filter(
            (p) =>
              p.category?._id === params.category ||
              p.category?.name?.toLowerCase() === params.category.toLowerCase()
          );
        }

        // Filter by search query
        if (params.search && params.search.trim()) {
          const query = params.search.trim().toLowerCase();
          products = products.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              (p.description && p.description.toLowerCase().includes(query))
          );
        }

        return { success: true, count: products.length, data: products };
      }
      throw new Error(err.response?.data?.message || 'Failed to fetch products');
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const products = getLocalStore(STORAGE_KEY, INITIAL_PRODUCTS);
        const product = products.find((p) => p._id === id);
        if (!product) {
          throw new Error('Product not found');
        }
        return { success: true, data: product };
      }
      throw new Error(err.response?.data?.message || 'Failed to fetch product');
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await axiosClient.post('/products', productData);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const products = getLocalStore(STORAGE_KEY, INITIAL_PRODUCTS);
        const categories = getLocalStore(CAT_STORAGE_KEY, INITIAL_CATEGORIES);
        const selectedCategory = categories.find((c) => c._id === productData.category) || {
          _id: productData.category,
          name: 'General',
        };

        const newProd = {
          _id: 'prod_' + Date.now(),
          name: productData.name,
          description: productData.description || '',
          price: Number(productData.price),
          image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          category: selectedCategory,
          stock: Number(productData.stock) || 0,
          createdAt: new Date().toISOString(),
        };

        const updated = [newProd, ...products];
        setLocalStore(STORAGE_KEY, updated);
        return { success: true, message: 'Product created successfully', data: newProd };
      }
      throw new Error(err.response?.data?.message || 'Failed to create product');
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await axiosClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const products = getLocalStore(STORAGE_KEY, INITIAL_PRODUCTS);
        const categories = getLocalStore(CAT_STORAGE_KEY, INITIAL_CATEGORIES);

        let updatedProd = null;
        const updated = products.map((p) => {
          if (p._id === id) {
            let cat = p.category;
            if (productData.category) {
              cat = categories.find((c) => c._id === productData.category) || p.category;
            }
            updatedProd = {
              ...p,
              ...productData,
              price: productData.price !== undefined ? Number(productData.price) : p.price,
              stock: productData.stock !== undefined ? Number(productData.stock) : p.stock,
              category: cat,
            };
            return updatedProd;
          }
          return p;
        });

        setLocalStore(STORAGE_KEY, updated);
        return { success: true, message: 'Product updated successfully', data: updatedProd };
      }
      throw new Error(err.response?.data?.message || 'Failed to update product');
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosClient.delete(`/products/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const products = getLocalStore(STORAGE_KEY, INITIAL_PRODUCTS);
        const updated = products.filter((p) => p._id !== id);
        setLocalStore(STORAGE_KEY, updated);
        return { success: true, message: 'Product deleted successfully' };
      }
      throw new Error(err.response?.data?.message || 'Failed to delete product');
    }
  },
};
