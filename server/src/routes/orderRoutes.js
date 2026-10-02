import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer order routes (/api/orders)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes accessible under /api/admin/orders
export const adminOrderRoutes = express.Router();
adminOrderRoutes.get('/', protect, adminOnly, getAdminOrders);
adminOrderRoutes.patch('/:id/status', protect, adminOnly, updateOrderStatus);

// Also support admin routes under /api/orders/admin for flexibility
router.get('/admin', protect, adminOnly, getAdminOrders);
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
