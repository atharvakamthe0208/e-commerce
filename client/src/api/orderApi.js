import axiosClient from './axiosClient';
import { INITIAL_ORDERS } from './mockData';

export const orderApi = {
  getMyOrders: async () => {
    try {
      const response = await axiosClient.get('/orders/my-orders');
      // API returns { success, data: [...] } or array directly
      const result = response?.data ?? response;
      return Array.isArray(result) ? result : [];
    } catch (err) {
      const storedOrders = localStorage.getItem('demo_orders');
      if (storedOrders) {
        return JSON.parse(storedOrders);
      }
      return INITIAL_ORDERS;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axiosClient.post('/orders', orderData);
      return response.data || response;
    } catch (err) {
      const existing = localStorage.getItem('demo_orders')
        ? JSON.parse(localStorage.getItem('demo_orders'))
        : [...INITIAL_ORDERS];

      const newOrder = {
        _id: '651e' + Math.random().toString(16).substring(2, 10),
        products: orderData.items,
        totalAmount: orderData.totalAmount || 0,
        shippingAddress: orderData.shippingAddress,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      existing.unshift(newOrder);
      localStorage.setItem('demo_orders', JSON.stringify(existing));
      return {
        success: true,
        message: 'Order placed successfully (Offline Demo Mode)',
        data: newOrder,
      };
    }
  },
};
