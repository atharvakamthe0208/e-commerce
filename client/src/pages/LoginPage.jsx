import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email.trim(), password);
      toast.success(res.message || 'Login successful');

      // Check if logged-in user is admin
      if (res.data?.isAdmin) {
        navigate(redirectUrl || '/admin/products');
      } else {
        navigate(redirectUrl || '/');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@ecommerce.com');
    setPassword('admin123');
  };

  const fillDemoCustomer = () => {
    setEmail('demo@ecommerce.com');
    setPassword('demo123');
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl m-0">
            Sign in to your account
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Or{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              create a new customer account
            </Link>
          </p>
        </div>

        {/* Demo Fast-Login Helpers */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
            Demo Credentials (1-Click Fill):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-white py-2 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition shadow-2xs"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-white py-2 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition shadow-2xs"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecommerce.com"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
