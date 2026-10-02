import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Banknote, Loader2, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, totalItemsCount, subtotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);

  // Auto-populate user name if available
  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please select products first.');
      navigate('/products');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
      };

      const res = await orderApi.placeOrder(orderPayload);
      toast.success(res.message || 'Order placed successfully! Cash on delivery confirmed.');

      // Clear shopping cart
      clearCart();

      // Redirect customer to My Orders page
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please verify stock.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Cannot proceed with empty cart"
          description="You do not have any items in your cart to checkout."
          actionLabel="Go to Products Catalog"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="pb-6 border-b border-slate-200">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Shopping Cart</span>
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl m-0">
          Cash on Delivery Checkout
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your delivery destination and confirm your order.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Delivery Address Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 m-0">Delivery Address</h2>
                  <p className="text-xs text-slate-500">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Full Recipient Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Mercer"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1-555-8392"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Street Address & Apartment <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Springfield"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Postal Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g. 97477"
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section: Fixed Cash on Delivery */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 m-0">Payment Method</h2>
                  <p className="text-xs text-slate-500">Pay safely in cash when your parcel arrives</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between rounded-xl border-2 border-indigo-600 bg-indigo-50/40 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      checked
                      readOnly
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="cod" className="flex flex-col cursor-pointer">
                      <span className="text-sm font-bold text-slate-900">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-slate-500">
                        Pay cash directly to the courier upon doorstep delivery.
                      </span>
                    </label>
                  </div>
                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
                    No Extra Fees
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Review Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 m-0">
              Review Items ({totalItemsCount})
            </h2>

            <div className="mt-4 divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                      }}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[170px]">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × ${Number(item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total Due (COD)</span>
                <span className="text-2xl font-black text-indigo-600">
                  ${subtotalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Place Order (COD)</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Secure checkout. Pay upon delivery.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
