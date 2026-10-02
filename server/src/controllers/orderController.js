import mongoose from 'mongoose';
import Order, { ORDER_STATUSES } from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Place a new COD order with authoritative server-side price & atomic stock decrement
// @route   POST /api/orders
// @access  Customer (Authenticated)
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const rawItems = req.body.items || req.body.products;

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all shipping address fields (name, phone, address, city, pincode)',
      });
    }

    // 1. Verify all products and check stock availability
    let calculatedTotal = 0;
    const verifiedOrderItems = [];

    for (const item of rawItems) {
      const productId = item.product || item._id;
      const quantity = Number(item.quantity);

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${productId}`,
        });
      }

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1 for all items',
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${productId} not found or inactive`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.stock}`,
        });
      }

      // Authoritative database price ONLY
      const authoritativePrice = product.price;
      calculatedTotal += authoritativePrice * quantity;

      verifiedOrderItems.push({
        product: product._id,
        quantity,
        price: authoritativePrice,
      });
    }

    // 2. Perform atomic stock decrement with rollback on race condition failure
    const decrementedList = [];

    for (const item of verifiedOrderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true }
      );

      if (!updatedProduct) {
        // Rollback any earlier decremented items in this transaction
        for (const rolled of decrementedList) {
          await Product.findByIdAndUpdate(rolled.product, {
            $inc: { stock: rolled.quantity },
          });
        }

        const product = await Product.findById(item.product);
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product?.name || item.product}'. Available: ${product?.stock || 0}`,
        });
      }

      decrementedList.push({
        product: item.product,
        quantity: item.quantity,
      });
    }

    // 3. Create order document with verified prices and calculated total
    const order = await Order.create({
      user: req.user._id,
      products: verifiedOrderItems,
      totalAmount: Math.round(calculatedTotal * 100) / 100,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      status: 'Pending',
    });

    const populatedOrder = await Order.findById(order._id).populate(
      'products.product',
      'name image price'
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders/my-orders
// @access  Customer (Authenticated)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name image price')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across platform
// @route   GET /api/admin/orders
// @access  Admin
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!status || !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status value',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const previousStatus = order.status;

    // If order was cancelled and now changed, or if changing to cancelled:
    if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      // Restore stock for cancelled order
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    } else if (previousStatus === 'Cancelled' && status !== 'Cancelled') {
      // Re-decrement stock if uncancelled
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price image');

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
