import React from 'react';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-sm font-extrabold text-slate-900">
              Mini<span className="text-indigo-600">Commerce</span>
            </span>
            <span className="text-xs text-slate-400">| MERN Mini E-Commerce Demo</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
            <Link to="/cart" className="hover:text-indigo-600 transition">Shopping Cart</Link>
            <Link to="/login" className="hover:text-indigo-600 transition">Sign In</Link>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} MiniCommerce. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
