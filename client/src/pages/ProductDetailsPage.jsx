import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getProductById(id);
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Product Not Found"
          description={error || "The item you're looking for doesn't exist or has been removed."}
          actionText="Back to Products"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const categoryName =
    typeof product.category === 'object' ? product.category?.name : product.category;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${product.stock} items available in stock.`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Products</span>
      </Link>

      {/* Split View Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10">
        {/* Left Column: Product Image */}
        <div className="flex flex-col items-center justify-center bg-slate-50/80 rounded-2xl p-4 sm:p-8 border border-slate-100">
          <div className="relative w-full aspect-square max-w-md overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200/80">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category badge & Rating */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                {categoryName || 'General'}
              </span>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {product.rating || '4.8'}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.reviewsCount || 42} reviews)
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">USD (Inclusive of all taxes)</span>
            </div>

            {/* Stock Indicator */}
            <div className="pt-1">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Out of Stock</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    In Stock ({product.stock} units ready to ship)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About this item
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-1 bg-slate-50 w-full sm:w-36">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-800 px-3">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Add to Cart button */}
              <button
                type="button"
                id="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-bold shadow-md transition-all duration-200 active:scale-95 ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 hover:shadow-lg'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : `Add ${quantity} to Cart`}</span>
              </button>
            </div>

            {/* Value perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <Truck className="w-4 h-4 text-indigo-500" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <RotateCcw className="w-4 h-4 text-emerald-500" />
                <span>7-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
