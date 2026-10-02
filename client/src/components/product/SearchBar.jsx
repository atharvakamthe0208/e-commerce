import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search products, electronics, apparel...',
  className = '',
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        id="product-search-input"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-subtle focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
      />

      {searchQuery && (
        <button
          type="button"
          id="search-clear-button"
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
