import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const categoryName =
    typeof product.category === 'object' ? product.category?.name : product.category;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-card-hover hover:border-slate-300 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Product Image Presentation */}
      <Link
        to={`/products/${product._id}`}
        className="relative block w-full aspect-square bg-slate-100 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Category Pill Over Image */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-white/60">
            {categoryName || 'General'}
          </span>
        </div>

        {/* Stock Badge Overlay */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 backdrop-blur-md text-white shadow-sm">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-700">
            {product.rating || '4.8'}
          </span>
          <span className="text-[11px] text-slate-400">
            ({product.reviewsCount || 42})
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product._id}`} className="group-hover:text-indigo-600 transition">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Short description preview */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Footer: Price and Add to Cart Button */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
              Price
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:shadow-md hover:shadow-indigo-200'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </span>
            <span className="sm:hidden">{isOutOfStock ? 'Sold' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
