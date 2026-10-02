import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalItemsCount, subtotalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="Looks like you haven't added anything to your cart yet. Explore our latest arrivals and deals."
          actionLabel="Browse Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl m-0">
              Shopping Cart
            </h1>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review your selected products and proceed to Cash on Delivery checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition self-start sm:self-auto"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Entire Cart</span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {cartItems.map((item) => {
              const { product, quantity } = item;
              const maxStock = Number(product.stock) || 1;
              const isMaxStockReached = quantity >= maxStock;

              return (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4 hover:bg-slate-50/50 transition"
                >
                  {/* Product Details */}
                  <div className="flex items-start sm:items-center gap-4">
                    <Link to={`/products/${product._id}`} className="shrink-0 group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-cover border border-slate-100 bg-slate-50 group-hover:scale-105 transition duration-200"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                        }}
                      />
                    </Link>

                    <div className="flex flex-col">
                      <Link
                        to={`/products/${product._id}`}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <span className="text-xs text-slate-400 mt-0.5">
                        Category: {product.category?.name || 'General'}
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400">each</span>
                      </div>
                      {isMaxStockReached && (
                        <span className="mt-1 text-[11px] font-semibold text-amber-600">
                          Max available inventory reached ({maxStock})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Removal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t border-slate-100 sm:border-none">
                    {/* Stepper */}
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="w-10 text-center font-bold text-sm text-slate-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        disabled={isMaxStockReached}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal for line item */}
                    <div className="w-24 text-right">
                      <span className="text-base font-bold text-slate-900">
                        ${(Number(product.price) * quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product._id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 m-0">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({totalItemsCount})</span>
                <span className="font-semibold text-slate-900">${subtotalPrice.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  Standard Delivery
                </span>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  FREE
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Payment Method</span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Cash on Delivery (COD)
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total Price</span>
                <div className="text-right">
                  <span className="text-2xl font-black tracking-tight text-indigo-600">
                    ${subtotalPrice.toFixed(2)}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Includes all taxes</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Safe Cash on Delivery verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
