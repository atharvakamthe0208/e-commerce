// Initial fixtures based on docs/DEMO_FLOW_AND_TESTING.md

export const INITIAL_CATEGORIES = [
  {
    _id: '651c11111111111111111111',
    name: 'Electronics',
    description: 'Gadgets, audio, smartphones, and accessories',
    createdAt: new Date('2026-09-15T10:00:00Z').toISOString(),
  },
  {
    _id: '651c22222222222222222222',
    name: 'Fashion',
    description: 'Casual and formal apparel and lifestyle items',
    createdAt: new Date('2026-09-15T10:05:00Z').toISOString(),
  },
  {
    _id: '651c33333333333333333333',
    name: 'Shoes',
    description: 'Sneakers, running shoes, and formal footwear',
    createdAt: new Date('2026-09-15T10:10:00Z').toISOString(),
  },
];

export const INITIAL_PRODUCTS = [
  {
    _id: '651d11111111111111111111',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium noise-canceling over-ear wireless headphones with 40-hour battery life and studio acoustic tuning.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: {
      _id: '651c11111111111111111111',
      name: 'Electronics',
    },
    stock: 15,
    createdAt: new Date('2026-09-16T08:30:00Z').toISOString(),
  },
  {
    _id: '651d22222222222222222222',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with tactile switches, aircraft-grade aluminum frame, and detachable wrist rest.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    category: {
      _id: '651c11111111111111111111',
      name: 'Electronics',
    },
    stock: 20,
    createdAt: new Date('2026-09-16T09:00:00Z').toISOString(),
  },
  {
    _id: '651d33333333333333333333',
    name: 'Classic Denim Jacket',
    description: 'Timeless washed indigo denim jacket with brass button accents and heavy-duty reinforced stitching.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    category: {
      _id: '651c22222222222222222222',
      name: 'Fashion',
    },
    stock: 12,
    createdAt: new Date('2026-09-16T09:30:00Z').toISOString(),
  },
  {
    _id: '651d44444444444444444444',
    name: 'Minimalist Cotton T-Shirt',
    description: '100% organic combed ring-spun cotton t-shirt with modern regular fit and super soft breathable touch.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    category: {
      _id: '651c22222222222222222222',
      name: 'Fashion',
    },
    stock: 50,
    createdAt: new Date('2026-09-16T10:00:00Z').toISOString(),
  },
  {
    _id: '651d55555555555555555555',
    name: 'Urban High-Top Sneakers',
    description: 'Streetwear high-top leather sneakers with cushioned ankle support and high-traction rubber outsole.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
    category: {
      _id: '651c33333333333333333333',
      name: 'Shoes',
    },
    stock: 3, // Low stock demo (< 5)
    createdAt: new Date('2026-09-16T10:30:00Z').toISOString(),
  },
  {
    _id: '651d66666666666666666666',
    name: 'Performance Running Shoes',
    description: 'Ultra-lightweight mesh running shoes with responsive foam cushioning and breathable aerated upper.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: {
      _id: '651c33333333333333333333',
      name: 'Shoes',
    },
    stock: 14,
    createdAt: new Date('2026-09-16T11:00:00Z').toISOString(),
  },
];

export const INITIAL_ORDERS = [
  {
    _id: '651e44444444444444444444',
    user: {
      _id: '651a2b3c4d5e6f7a8b9c0d1e',
      name: 'Alex Mercer',
      email: 'demo@ecommerce.com',
    },
    products: [
      {
        product: {
          _id: '651d11111111111111111111',
          name: 'Wireless Noise-Canceling Headphones',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        },
        quantity: 1,
        price: 199.99,
      },
    ],
    totalAmount: 199.99,
    shippingAddress: {
      name: 'Alex Mercer',
      phone: '+1-555-8392',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      pincode: '97477',
    },
    status: 'Pending',
    createdAt: new Date('2026-10-02T10:15:00Z').toISOString(),
  },
];

export const getLocalStore = (key, initialValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
};

export const setLocalStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
};
