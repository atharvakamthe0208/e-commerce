import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  const isOutOfStock = Number(product.stock) <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const itemInCart = cartItems.find((i) => i.product._id === product._id);
  const qtyInCart = itemInCart ? itemInCart.quantity : 0;
  const isMaxReached = qtyInCart >= product.stock;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && !isMaxReached) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Product Image Link */}
      <Link to={`/products/${product._id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
          }}
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs border border-white/60">
            {product.category?.name || 'General'}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 right-3">
          {isOutOfStock ? (
            <span className="rounded-md bg-rose-600/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-md bg-amber-500/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              Only {product.stock} Left!
            </span>
          ) : null}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          to={`/products/${product._id}`}
          className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
          title={product.name}
        >
          {product.name}
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price and Cart Action */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</span>
            <span className="text-lg font-black text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock || isMaxReached}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isOutOfStock || isMaxReached
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 active:scale-95'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : isMaxReached ? 'Max In Cart' : qtyInCart > 0 ? `In Cart (${qtyInCart})` : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
