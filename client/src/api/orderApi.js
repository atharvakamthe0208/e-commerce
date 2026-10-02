import axiosClient from './axiosClient';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, getLocalStore, setLocalStore } from './mockData';

const STORAGE_KEY = 'mini_ecommerce_orders';
const PRODUCT_STORAGE_KEY = 'mini_ecommerce_products';

export const orderApi = {
  placeOrder: async (orderPayload) => {
    try {
      const response = await axiosClient.post('/orders', orderPayload);
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const orders = getLocalStore(STORAGE_KEY, INITIAL_ORDERS);
        const products = getLocalStore(PRODUCT_STORAGE_KEY, INITIAL_PRODUCTS);

        // Calculate total and decrement inventory atomically in mock store
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of orderPayload.items) {
          const product = products.find((p) => p._id === (item.product?._id || item.product));
          if (!product) {
            throw new Error(`Product not found: ${item.product}`);
          }
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product '${product.name}'. Available: ${product.stock}`);
          }

          // Decrement stock
          product.stock -= item.quantity;
          totalAmount += product.price * item.quantity;

          orderProducts.push({
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
            },
            quantity: item.quantity,
            price: product.price,
          });
        }

        // Save updated product stock
        setLocalStore(PRODUCT_STORAGE_KEY, products);

        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : { _id: 'guest', name: orderPayload.shippingAddress.name, email: 'customer@ecommerce.com' };

        const newOrder = {
          _id: '651e' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
          user: {
            _id: user._id,
            name: user.name || orderPayload.shippingAddress.name,
            email: user.email,
          },
          products: orderProducts,
          totalAmount: Number(totalAmount.toFixed(2)),
          shippingAddress: orderPayload.shippingAddress,
          status: 'Pending',
          paymentMethod: 'COD',
          createdAt: new Date().toISOString(),
        };

        const updatedOrders = [newOrder, ...orders];
        setLocalStore(STORAGE_KEY, updatedOrders);

        return {
          success: true,
          message: 'Order placed successfully',
          data: newOrder,
        };
      }
      throw new Error(err.response?.data?.message || 'Failed to place order');
    }
  },

  getMyOrders: async () => {
    try {
      const response = await axiosClient.get('/orders/my-orders');
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const orders = getLocalStore(STORAGE_KEY, INITIAL_ORDERS);
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;

        // In demo mode, return orders matching current user or all non-admin customer orders
        const userOrders = user
          ? orders.filter((o) => o.user?.email === user.email || o.user?._id === user._id)
          : orders;

        return { success: true, count: userOrders.length, data: userOrders.length ? userOrders : orders };
      }
      throw new Error(err.response?.data?.message || 'Failed to fetch order history');
    }
  },

  getAdminOrders: async () => {
    try {
      const response = await axiosClient.get('/admin/orders');
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const orders = getLocalStore(STORAGE_KEY, INITIAL_ORDERS);
        return { success: true, count: orders.length, data: orders };
      }
      throw new Error(err.response?.data?.message || 'Failed to fetch admin orders');
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await axiosClient.patch(`/admin/orders/${id}/status`, { status });
      return response.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        const orders = getLocalStore(STORAGE_KEY, INITIAL_ORDERS);
        let updatedOrder = null;

        const updated = orders.map((o) => {
          if (o._id === id) {
            updatedOrder = { ...o, status, updatedAt: new Date().toISOString() };
            return updatedOrder;
          }
          return o;
        });

        setLocalStore(STORAGE_KEY, updated);
        return {
          success: true,
          message: `Order status updated to ${status}`,
          data: updatedOrder,
        };
      }
      throw new Error(err.response?.data?.message || 'Failed to update order status');
    }
  },
};
