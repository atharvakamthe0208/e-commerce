import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import User from '../src/models/User.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../src/controllers/categoryController.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../src/controllers/productController.js';
import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
} from '../src/controllers/orderController.js';
import { protect } from '../src/middleware/authMiddleware.js';
import { adminOnly } from '../src/middleware/adminMiddleware.js';
import generateToken from '../src/utils/generateToken.js';

// Helper to create mock res object
const createMockRes = () => {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
  };
  return res;
};

describe('Category Controller & Logic', () => {
  it('createCategory should return 400 if name is empty', async () => {
    const req = { body: { name: '   ', description: 'test' } };
    const res = createMockRes();
    const next = mock.fn();

    await createCategory(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /Category name is required/);
  });

  it('createCategory should return 400 if category with same name exists', async () => {
    mock.method(Category, 'findOne', async () => ({ _id: 'cat1', name: 'Electronics' }));

    const req = { body: { name: 'Electronics', description: 'tech' } };
    const res = createMockRes();
    const next = mock.fn();

    await createCategory(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.message, 'Category already exists');

    Category.findOne.mock.restore();
  });

  it('createCategory should create and return 201 on valid input', async () => {
    mock.method(Category, 'findOne', async () => null);
    mock.method(Category, 'create', async (data) => ({
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      description: data.description,
    }));

    const req = { body: { name: 'Electronics', description: 'Smartphones & gadgets' } };
    const res = createMockRes();
    const next = mock.fn();

    await createCategory(req, res, next);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, 'Electronics');

    Category.findOne.mock.restore();
    Category.create.mock.restore();
  });

  it('deleteCategory should reject deletion if products reference it', async () => {
    const catId = new mongoose.Types.ObjectId().toString();
    mock.method(Category, 'findById', async () => ({ _id: catId, name: 'Shoes' }));
    mock.method(Product, 'countDocuments', async () => 3);

    const req = { params: { id: catId } };
    const res = createMockRes();
    const next = mock.fn();

    await deleteCategory(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /Cannot delete category: 3 product\(s\) are associated/);

    Category.findById.mock.restore();
    Product.countDocuments.mock.restore();
  });
});

describe('Product Controller & Logic', () => {
  it('createProduct should reject missing fields or negative price/stock', async () => {
    const req = {
      body: {
        name: 'Test Product',
        description: 'Desc',
        price: -10,
        image: 'http://example.com/img.jpg',
        category: new mongoose.Types.ObjectId().toString(),
      },
    };
    const res = createMockRes();
    const next = mock.fn();

    await createProduct(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.message, 'Price cannot be negative');
  });

  it('createProduct should return 400 if category does not exist', async () => {
    const validCatId = new mongoose.Types.ObjectId().toString();
    mock.method(Category, 'findById', async () => null);

    const req = {
      body: {
        name: 'Test Product',
        description: 'Desc',
        price: 99.99,
        image: 'http://example.com/img.jpg',
        category: validCatId,
        stock: 5,
      },
    };
    const res = createMockRes();
    const next = mock.fn();

    await createProduct(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.message, 'Category does not exist');

    Category.findById.mock.restore();
  });

  it('getProductById should return 404 for non-existent product', async () => {
    mock.method(Product, 'findById', () => ({
      populate: async () => null,
    }));

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = createMockRes();
    const next = mock.fn();

    await getProductById(req, res, next);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.data.message, 'Product not found');

    Product.findById.mock.restore();
  });
});

describe('Order Controller & Stock Integrity', () => {
  const dummyUser = { _id: new mongoose.Types.ObjectId(), isAdmin: false };
  const prodId = new mongoose.Types.ObjectId();

  it('createOrder should reject order when shipping address is incomplete', async () => {
    const req = {
      user: dummyUser,
      body: {
        items: [{ product: prodId.toString(), quantity: 1 }],
        shippingAddress: { name: 'Alex' }, // missing phone, address, city, pincode
      },
    };
    const res = createMockRes();
    const next = mock.fn();

    await createOrder(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /Please provide all shipping address fields/);
  });

  it('createOrder should reject order if requested quantity exceeds product stock', async () => {
    mock.method(Product, 'findById', async () => ({
      _id: prodId,
      name: 'Wireless Headphones',
      price: 199.99,
      stock: 3, // only 3 available
    }));

    const req = {
      user: dummyUser,
      body: {
        items: [{ product: prodId.toString(), quantity: 5 }], // requested 5
        shippingAddress: {
          name: 'Alex Mercer',
          phone: '+1-555-8392',
          address: '742 Evergreen Terrace',
          city: 'Springfield',
          pincode: '97477',
        },
      },
    };
    const res = createMockRes();
    const next = mock.fn();

    await createOrder(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /Insufficient stock for product 'Wireless Headphones'. Available: 3/);

    Product.findById.mock.restore();
  });

  it('createOrder should use authoritative DB price and ignore client-submitted prices', async () => {
    const authoritativePrice = 199.99;
    const clientHackedPrice = 0.99; // Client attempting price tampering

    mock.method(Product, 'findById', async (id) => {
      if (id.toString() === prodId.toString()) {
        return {
          _id: prodId,
          name: 'Wireless Headphones',
          price: authoritativePrice, // Real DB price
          stock: 10,
        };
      }
      return null;
    });

    mock.method(Product, 'findOneAndUpdate', async () => ({
      _id: prodId,
      stock: 8,
    }));

    let savedOrderPayload = null;
    mock.method(Order, 'create', async (payload) => {
      savedOrderPayload = payload;
      return {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
      };
    });

    mock.method(Order, 'findById', () => ({
      populate: async () => ({
        _id: 'order123',
        ...savedOrderPayload,
      }),
    }));

    const req = {
      user: dummyUser,
      body: {
        items: [
          {
            product: prodId.toString(),
            quantity: 2,
            price: clientHackedPrice, // Hacked price sent by client!
          },
        ],
        shippingAddress: {
          name: 'Alex Mercer',
          phone: '+1-555-8392',
          address: '742 Evergreen Terrace',
          city: 'Springfield',
          pincode: '97477',
        },
      },
    };
    const res = createMockRes();
    const next = mock.fn();

    await createOrder(req, res, next);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.data.success, true);

    // Verify the server calculated totalAmount based strictly on authoritative DB price: 199.99 * 2 = 399.98
    assert.strictEqual(savedOrderPayload.totalAmount, 399.98);
    assert.strictEqual(savedOrderPayload.products[0].price, authoritativePrice);
    assert.notStrictEqual(savedOrderPayload.totalAmount, clientHackedPrice * 2);

    Product.findById.mock.restore();
    Product.findOneAndUpdate.mock.restore();
    Order.create.mock.restore();
    Order.findById.mock.restore();
  });

  it('updateOrderStatus should validate enum and restore stock on cancellation', async () => {
    const orderId = new mongoose.Types.ObjectId().toString();
    const mockOrder = {
      _id: orderId,
      status: 'Confirmed',
      products: [{ product: prodId, quantity: 2, price: 199.99 }],
      save: mock.fn(async () => {}),
    };

    mock.method(Order, 'findById', (id) => {
      return Object.assign(mockOrder, {
        populate: () => ({
          populate: async () => mockOrder,
        }),
      });
    });

    let restoredProduct = null;
    mock.method(Product, 'findByIdAndUpdate', async (id, update) => {
      restoredProduct = { id, update };
      return true;
    });

    const req = {
      params: { id: orderId },
      body: { status: 'Cancelled' },
    };
    const res = createMockRes();
    const next = mock.fn();

    await updateOrderStatus(req, res, next);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(mockOrder.status, 'Cancelled');

    // Confirm that product stock was restored by +2
    assert.ok(restoredProduct);
    assert.strictEqual(restoredProduct.update.$inc.stock, 2);

    Order.findById.mock.restore();
    Product.findByIdAndUpdate.mock.restore();
  });
});

describe('Middleware Gates (Authentication & Admin)', () => {
  it('adminOnly middleware should allow admin users and reject customers with 403', () => {
    const adminReq = { user: { isAdmin: true } };
    const customerReq = { user: { isAdmin: false } };
    const res = createMockRes();
    const nextAdmin = mock.fn();
    const nextCust = mock.fn();

    adminOnly(adminReq, res, nextAdmin);
    assert.strictEqual(nextAdmin.mock.callCount(), 1);

    adminOnly(customerReq, res, nextCust);
    assert.strictEqual(nextCust.mock.callCount(), 0);
    assert.strictEqual(res.statusCode, 403);
    assert.match(res.data.message, /Access denied: Administrator privileges required/);
  });

  it('protect middleware should reject requests without Authorization header', async () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = mock.fn();

    await protect(req, res, next);
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /Not authorized, no token provided/);
  });

  it('protect middleware should allow valid token and attach req.user', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = generateToken(userId, false);

    mock.method(User, 'findById', () => ({
      select: async () => ({ _id: userId, name: 'Jane Doe', isAdmin: false }),
    }));

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res = createMockRes();
    const next = mock.fn();

    await protect(req, res, next);
    assert.strictEqual(next.mock.callCount(), 1);
    assert.ok(req.user);
    assert.strictEqual(req.user._id, userId);

    User.findById.mock.restore();
  });
});
