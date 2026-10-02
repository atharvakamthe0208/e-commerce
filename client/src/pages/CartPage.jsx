import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/common/EmptyState';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalItemsCount, subtotalPrice } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <EmptyState
          icon={ShoppingCart}
          title="Your Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our high-performance gear and trendy collections!"
          actionText="Browse Catalog"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  const shippingFee = 0; // Free COD Shipping
  const grandTotal = subtotalPrice + shippingFee;

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
      </div>

      {/* 2-Pane Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Pane: Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle divide-y divide-slate-100 overflow-hidden">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
              >
                {/* Product thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 border border-slate-200/60 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                    }}
                  />

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {typeof product.category === 'object' ? product.category?.name : product.category}
                    </span>
                    <Link
                      to={`/products/${product._id}`}
                      className="block font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition truncate mt-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ${Number(product.price).toFixed(2)} each
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      In Stock ({product.stock} available)
                    </p>
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-40 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 px-3">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-40 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for item */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      ${(quantity * product.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Order Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">${subtotalPrice.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-1.5">
                <span>Shipping</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Free COD
                </span>
              </div>
              <span className="font-bold text-emerald-600">$0.00</span>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">Estimated Total</span>
              <span className="text-2xl font-black text-indigo-600">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            id="proceed-to-checkout-button"
            onClick={handleProceedToCheckout}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Free standard delivery on Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Safe checkout with price guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
