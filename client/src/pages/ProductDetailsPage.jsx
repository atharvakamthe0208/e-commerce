import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus, CheckCircle2, AlertCircle } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProductById(id);
        setProduct(res.data);
      } catch (err) {
        toast.error(err.message || 'Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <Loader fullScreen text="Loading product details..." />;
  }

  if (!product) return null;

  const availableStock = Number(product.stock) || 0;
  const isOutOfStock = availableStock <= 0;

  // Check how many are currently in cart
  const itemInCart = cartItems.find((i) => i.product._id === product._id);
  const qtyInCart = itemInCart ? itemInCart.quantity : 0;
  const remainingPurchasable = Math.max(0, availableStock - qtyInCart);

  const handleIncrement = () => {
    if (quantity < remainingPurchasable) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Cannot select more than remaining stock (${remainingPurchasable} units)`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Product Image */}
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Product Information & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category badge */}
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {product.category?.name || 'General Department'}
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl m-0 leading-tight">
              {product.name}
            </h1>

            {/* Price & Stock Badge */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-3xl font-black text-slate-900">
                ${Number(product.price).toFixed(2)}
              </span>

              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Out of Stock
                </span>
              ) : availableStock < 5 ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Low Stock — Only {availableStock} Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  In Stock ({availableStock} units)
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-b border-slate-200 py-4 my-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* In-cart summary notice if already in cart */}
            {qtyInCart > 0 && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs text-indigo-900 flex items-center justify-between">
                <span>You currently have <strong>{qtyInCart}</strong> of this item in your shopping cart.</span>
                <Link to="/cart" className="font-bold underline hover:text-indigo-700">
                  View Cart
                </Link>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Stepper */}
                <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-1.5 w-full sm:w-36">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="font-bold text-slate-900 text-sm">{quantity}</span>

                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= remainingPurchasable || isOutOfStock}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || remainingPurchasable <= 0}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isOutOfStock || remainingPurchasable <= 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99]'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>
                    {isOutOfStock
                      ? 'Currently Out of Stock'
                      : remainingPurchasable <= 0
                      ? 'Max Stock in Cart'
                      : 'Add to Cart'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Guarantees & Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-slate-600 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>7 Days Return</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>100% Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
