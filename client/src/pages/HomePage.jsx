import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productApi.getProducts(),
          categoryApi.getCategories(),
        ]);
        setFeaturedProducts((prodRes.data || []).slice(0, 4));
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to load home fixtures', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-16 sm:pb-24 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-bold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen MERN E-Commerce Demo</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1] m-0">
                Shop Premium Essentials with <span className="text-indigo-600">Zero Friction</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
                Experience end-to-end e-commerce with real-time inventory management, Cash on Delivery (COD) checkout, and a comprehensive administration fulfillment console.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition active:scale-95"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <ShoppingBag className="h-4 w-4 text-indigo-600" />
                  <span>View Cart</span>
                </Link>
              </div>

              {/* Value Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Free COD Delivery</h4>
                    <p className="text-[11px] text-slate-400">Zero upfront payment</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Verified Catalog</h4>
                    <p className="text-[11px] text-slate-400">Authoritative stock</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Instant Admin</h4>
                    <p className="text-[11px] text-slate-400">Live order fulfillment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual Banner */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                  alt="Featured Gadget"
                  className="aspect-square w-full rounded-2xl object-cover"
                />
                <div className="mt-4 flex items-center justify-between p-2">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Featured</span>
                    <h3 className="text-base font-extrabold text-slate-900">Studio Wireless Pro</h3>
                  </div>
                  <span className="text-xl font-black text-slate-900">$199.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl m-0">
                Browse by Category
              </h2>
              <p className="text-xs text-slate-500 mt-1">Discover popular product departments</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h3>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description || 'Explore products in this collection'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl m-0">
              Featured Arrivals
            </h2>
            <p className="text-xs text-slate-500 mt-1">Handpicked bestsellers available for instant COD delivery</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            <span>All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading featured products..." />
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
