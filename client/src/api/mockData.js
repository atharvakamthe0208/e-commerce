export const INITIAL_CATEGORIES = [
  {
    _id: "651c11111111111111111111",
    name: "Electronics",
    description: "Gadgets, audio, smartphones, and accessories",
    createdAt: "2026-09-15T10:00:00.000Z",
  },
  {
    _id: "651c22222222222222222222",
    name: "Fashion",
    description: "Casual and formal apparel",
    createdAt: "2026-09-15T10:05:00.000Z",
  },
  {
    _id: "651c33333333333333333333",
    name: "Shoes",
    description: "Athletic sneakers and boots",
    createdAt: "2026-09-15T10:10:00.000Z",
  },
];

export const INITIAL_PRODUCTS = [
  {
    _id: "651d11111111111111111111",
    name: "Wireless Noise-Canceling Headphones",
    description:
      "Premium over-ear wireless headphones with active noise cancellation, ambient sound mode, and up to 40 hours of battery life. Immersive sound stage with crystal-clear highs and deep resonant bass.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    category: {
      _id: "651c11111111111111111111",
      name: "Electronics",
    },
    stock: 15,
    rating: 4.8,
    reviewsCount: 124,
    createdAt: "2026-09-16T08:30:00.000Z",
  },
  {
    _id: "651d22222222222222222222",
    name: "Mechanical Gaming Keyboard",
    description:
      "RGB backlit mechanical gaming keyboard with ultra-responsive tactile switches, macro customization, and durable aerospace-grade aluminum frame.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    category: {
      _id: "651c11111111111111111111",
      name: "Electronics",
    },
    stock: 20,
    rating: 4.9,
    reviewsCount: 89,
    createdAt: "2026-09-16T09:15:00.000Z",
  },
  {
    _id: "651d33333333333333333333",
    name: "Classic Denim Jacket",
    description:
      "Timeless rugged denim jacket crafted from 100% organic heavy-weight cotton. Features copper-tone shank buttons, chest flap pockets, and a tailored relaxed silhouette.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    category: {
      _id: "651c22222222222222222222",
      name: "Fashion",
    },
    stock: 12,
    rating: 4.7,
    reviewsCount: 56,
    createdAt: "2026-09-17T11:20:00.000Z",
  },
  {
    _id: "651d44444444444444444444",
    name: "Minimalist Cotton T-Shirt",
    description:
      "Ultra-soft combed ringspun cotton crewneck t-shirt. Breathable, pre-shrunk, and engineered for durable all-day everyday wear.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    category: {
      _id: "651c22222222222222222222",
      name: "Fashion",
    },
    stock: 50,
    rating: 4.6,
    reviewsCount: 142,
    createdAt: "2026-09-17T14:45:00.000Z",
  },
  {
    _id: "651d55555555555555555555",
    name: "Urban High-Top Sneakers",
    description:
      "Street-ready premium leather high-top sneakers with cushioned ergonomic insoles, padded ankle collars, and durable vulcanized anti-slip rubber soles.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    category: {
      _id: "651c33333333333333333333",
      name: "Shoes",
    },
    stock: 8,
    rating: 4.9,
    reviewsCount: 201,
    createdAt: "2026-09-18T10:00:00.000Z",
  },
  {
    _id: "651d66666666666666666666",
    name: "Performance Running Shoes",
    description:
      "Lightweight engineered mesh running shoes with high-rebound responsive foam midsole, arch stabilizing bridge, and high-traction carbon rubber outsole.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    category: {
      _id: "651c33333333333333333333",
      name: "Shoes",
    },
    stock: 14,
    rating: 4.8,
    reviewsCount: 78,
    createdAt: "2026-09-18T16:30:00.000Z",
  },
];

export const INITIAL_ORDERS = [
  {
    _id: "651e44444444444444444444",
    user: "651a2b3c4d5e6f7a8b9c0d1e",
    products: [
      {
        product: {
          _id: "651d11111111111111111111",
          name: "Wireless Noise-Canceling Headphones",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
          price: 199.99,
        },
        quantity: 1,
        price: 199.99,
      },
      {
        product: {
          _id: "651d44444444444444444444",
          name: "Minimalist Cotton T-Shirt",
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
          price: 24.99,
        },
        quantity: 2,
        price: 24.99,
      },
    ],
    totalAmount: 249.97,
    shippingAddress: {
      name: "Alex Mercer",
      phone: "+1-555-8392",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      pincode: "97477",
    },
    status: "Confirmed",
    createdAt: "2026-10-01T14:22:00.000Z",
  },
  {
    _id: "651e55555555555555555555",
    user: "651a2b3c4d5e6f7a8b9c0d1e",
    products: [
      {
        product: {
          _id: "651d55555555555555555555",
          name: "Urban High-Top Sneakers",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
          price: 119.99,
        },
        quantity: 1,
        price: 119.99,
      },
    ],
    totalAmount: 119.99,
    shippingAddress: {
      name: "Alex Mercer",
      phone: "+1-555-8392",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      pincode: "97477",
    },
    status: "Delivered",
    createdAt: "2026-09-28T09:10:00.000Z",
  },
];
