import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables if running standalone
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log(`Connected to MongoDB for seeding at: ${mongoUri}`);
    }

    // Clear existing collections
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing database records.');

    // 1. Seed Users (pre-save hook will hash passwords)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      isAdmin: true,
    });

    const demoUser = await User.create({
      name: 'Demo Customer',
      email: 'demo@ecommerce.com',
      password: 'demo123',
      isAdmin: false,
    });

    console.log(
      `Seeded 2 users: ${adminUser.email} (Admin), ${demoUser.email} (Customer)`
    );

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Electronics',
        description: 'Gadgets, audio, smartphones, and accessories',
      },
      {
        name: 'Fashion',
        description: 'Casual and formal apparel',
      },
      {
        name: 'Shoes',
        description: 'Athletic sneakers and boots',
      },
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCategories.length} categories.`);

    const electronicsCat = seededCategories.find((c) => c.name === 'Electronics');
    const fashionCat = seededCategories.find((c) => c.name === 'Fashion');
    const shoesCat = seededCategories.find((c) => c.name === 'Shoes');

    // 3. Seed Products
    const productsData = [
      {
        name: 'Wireless Noise-Canceling Headphones',
        description:
          'Premium over-ear wireless Bluetooth headphones with active noise cancellation, 40hr battery life, and crystal-clear acoustic fidelity.',
        price: 199.99,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        category: electronicsCat._id,
        stock: 15,
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description:
          'RGB backlit mechanical tactile keyboard with custom blue switches, aluminum framing, and programmable macro keys.',
        price: 89.99,
        image:
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        category: electronicsCat._id,
        stock: 20,
      },
      {
        name: 'Classic Denim Jacket',
        description:
          'Timeless vintage-washed denim jacket crafted from 100% durable organic cotton with dual chest flap pockets.',
        price: 69.99,
        image:
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
        category: fashionCat._id,
        stock: 12,
      },
      {
        name: 'Minimalist Cotton T-Shirt',
        description:
          'Ultra-soft combed ringspun cotton crewneck t-shirt designed for breathable all-day casual comfort.',
        price: 24.99,
        image:
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        category: fashionCat._id,
        stock: 50,
      },
      {
        name: 'Urban High-Top Sneakers',
        description:
          'Contemporary high-top sneakers with cushioned ankle support, vulcanized rubber cupsole, and breathable canvas upper.',
        price: 119.99,
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        category: shoesCat._id,
        stock: 8,
      },
      {
        name: 'Performance Running Shoes',
        description:
          'Lightweight engineered mesh running shoes with responsive foam midsole cushioning and high-traction grip tread.',
        price: 129.99,
        image:
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80',
        category: shoesCat._id,
        stock: 14,
      },
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProducts.length} products.`);

    console.log('Database seeded successfully! 🎉');
    return {
      users: [adminUser, demoUser],
      categories: seededCategories,
      products: seededProducts,
    };
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
    throw error;
  }
};

// Execute if run directly from command line
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
      process.exit(1);
    });
}

export default seedDatabase;
