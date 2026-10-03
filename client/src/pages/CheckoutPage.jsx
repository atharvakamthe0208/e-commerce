import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const { cartItems, subtotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '+1-555-8392',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    pincode: '97477',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-slate-500 text-sm">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const { name, phone, address, city, pincode } = formData;
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
        totalAmount: subtotalPrice,
      };

      await orderApi.createOrder(orderPayload);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Delivery
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6" id="checkout-form">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle p-6 sm:p-8 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                1. Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Recipient Full Name
                  </label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Contact Phone Number
                  </label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Street Address & Apartment
                  </label>
                  <input
                    id="checkout-address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    City / Town
                  </label>
                  <input
                    id="checkout-city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-pincode"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Postal Pincode / ZIP
                  </label>
                  <input
                    id="checkout-pincode"
                    name="pincode"
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle p-6 sm:p-8 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                2. Payment Method
              </h2>

              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/40 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  defaultChecked
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      Demo Choice
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pay with cash or card directly to the courier upon delivery
                  </p>
                </div>
                <Truck className="w-6 h-6 text-indigo-600 shrink-0" />
              </label>
            </div>

            <button
              type="submit"
              id="place-order-submit-button"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Order (${subtotalPrice.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Items Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Items in Order ({cartItems.length})
          </h3>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} className="py-3 flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Qty: {quantity} × ${Number(product.price).toFixed(2)}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  ${(quantity * product.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery</span>
              <span className="font-bold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Amount</span>
              <span className="text-indigo-600 text-lg">${subtotalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
