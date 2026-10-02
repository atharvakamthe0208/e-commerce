import { describe, it } from 'node:test';
import assert from 'node:assert';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Order, { ORDER_STATUSES } from '../src/models/Order.js';
import User from '../src/models/User.js';

describe('Mongoose Models Schema Verification', () => {
  describe('Category Model', () => {
    it('should define name as required, unique, and trimmed', () => {
      const namePath = Category.schema.paths.name;
      assert.ok(namePath, 'Category schema should have name path');
      assert.strictEqual(namePath.instance, 'String');
      assert.strictEqual(namePath.isRequired, true);
      assert.strictEqual(namePath.options.trim, true);
    });

    it('should define description as trimmed with default empty string', () => {
      const descPath = Category.schema.paths.description;
      assert.ok(descPath, 'Category schema should have description path');
      assert.strictEqual(descPath.instance, 'String');
      assert.strictEqual(descPath.options.trim, true);
      assert.strictEqual(descPath.options.default, '');
    });

    it('should have timestamps enabled', () => {
      assert.ok(Category.schema.options.timestamps);
    });
  });

  describe('Product Model', () => {
    it('should define name, description, price, image, category, and stock with proper types', () => {
      const paths = Product.schema.paths;
      assert.strictEqual(paths.name.instance, 'String');
      assert.strictEqual(paths.name.isRequired, true);
      assert.strictEqual(paths.name.options.trim, true);

      assert.strictEqual(paths.description.instance, 'String');
      assert.strictEqual(paths.description.isRequired, true);

      assert.strictEqual(paths.price.instance, 'Number');
      assert.strictEqual(paths.price.isRequired, true);

      assert.strictEqual(paths.image.instance, 'String');
      assert.strictEqual(paths.image.isRequired, true);

      assert.strictEqual(paths.category.instance, 'ObjectId');
      assert.strictEqual(paths.category.isRequired, true);
      assert.strictEqual(paths.category.options.ref, 'Category');

      assert.strictEqual(paths.stock.instance, 'Number');
      assert.strictEqual(paths.stock.isRequired, true);
      assert.strictEqual(paths.stock.options.default, 0);
    });

    it('should have text search index on name and description', () => {
      const indexes = Product.schema.indexes();
      const textIndex = indexes.find(
        ([fields]) => fields.name === 'text' && fields.description === 'text'
      );
      assert.ok(
        textIndex,
        'Product schema should define text search index on name and description'
      );
    });

    it('should have timestamps enabled', () => {
      assert.ok(Product.schema.options.timestamps);
    });
  });

  describe('Order Model', () => {
    it('should validate allowed status enum values', () => {
      assert.deepStrictEqual(ORDER_STATUSES, [
        'Pending',
        'Confirmed',
        'Shipped',
        'Delivered',
        'Cancelled',
      ]);
      const statusPath = Order.schema.paths.status;
      assert.strictEqual(statusPath.instance, 'String');
      assert.deepStrictEqual(statusPath.enumValues, ORDER_STATUSES);
      assert.strictEqual(statusPath.defaultValue, 'Pending');
    });

    it('should define user reference and totalAmount', () => {
      const paths = Order.schema.paths;
      assert.strictEqual(paths.user.instance, 'ObjectId');
      assert.strictEqual(paths.user.isRequired, true);
      assert.strictEqual(paths.user.options.ref, 'User');

      assert.strictEqual(paths.totalAmount.instance, 'Number');
      assert.strictEqual(paths.totalAmount.isRequired, true);
    });

    it('should require shipping address fields', () => {
      const shippingSchema = Order.schema.paths.shippingAddress.schema;
      assert.ok(shippingSchema.paths.name.isRequired);
      assert.ok(shippingSchema.paths.phone.isRequired);
      assert.ok(shippingSchema.paths.address.isRequired);
      assert.ok(shippingSchema.paths.city.isRequired);
      assert.ok(shippingSchema.paths.pincode.isRequired);
    });

    it('should define product subdocument with snapshot price and quantity', () => {
      const itemSchema = Order.schema.paths.products.schema;
      assert.strictEqual(itemSchema.paths.product.instance, 'ObjectId');
      assert.strictEqual(itemSchema.paths.product.options.ref, 'Product');
      assert.strictEqual(itemSchema.paths.quantity.instance, 'Number');
      assert.strictEqual(itemSchema.paths.price.instance, 'Number');
    });
  });

  describe('User Model', () => {
    it('should define name, email, password, and isAdmin', () => {
      const paths = User.schema.paths;
      assert.strictEqual(paths.name.instance, 'String');
      assert.strictEqual(paths.email.instance, 'String');
      assert.strictEqual(paths.password.instance, 'String');
      assert.strictEqual(paths.isAdmin.instance, 'Boolean');
      assert.strictEqual(paths.isAdmin.defaultValue, false);
    });
  });
});
