import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-subtle">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Cash on Delivery</h4>
                <p className="text-xs text-slate-500">Pay safely upon home delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-subtle">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">7-Day Free Returns</h4>
                <p className="text-xs text-slate-500">Hassle-free replacement guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-subtle">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Authentic Merchandise</h4>
                <p className="text-xs text-slate-500">100% verified original products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Shop<span className="text-indigo-600">Nova</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated premium lifestyle catalog featuring next-gen electronics, timeless apparel, and high-performance footwear.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] font-semibold text-slate-400">Powered by</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">MERN</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Tailwind</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/products" className="hover:text-indigo-600 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-indigo-600 transition">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-indigo-600 transition">
                  Fashion Apparel
                </Link>
              </li>
              <li>
                <Link to="/products?category=Shoes" className="hover:text-indigo-600 transition">
                  Footwear & Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Customer Account
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/my-orders" className="hover:text-indigo-600 transition">
                  Track Past Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-600 transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 transition">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 transition">
                  Create New Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Demo & Architecture Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Demo Credentials
            </h4>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1.5 text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Admin:</span> admin@ecommerce.com / admin123
              </div>
              <div>
                <span className="font-semibold text-slate-800">Demo User:</span> demo@ecommerce.com / demo123
              </div>
              <div className="pt-1 text-[10px] text-slate-400">
                Payment: Cash on Delivery (COD)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ShopNova. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern e-commerce.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
