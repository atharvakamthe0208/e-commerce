import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import CategoryFilter from '../components/product/CategoryFilter';
import SearchBar from '../components/product/SearchBar';
import ProductGrid from '../components/product/ProductGrid';
import { Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState(['All', 'Electronics', 'Fashion', 'Shoes']);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync category param change
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const query = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(query);
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const fetched = await categoryApi.getCategories();
        if (fetched && fetched.length > 0) {
          const names = ['All', ...fetched.map((c) => (typeof c === 'object' ? c.name : c))];
          setCategories(names);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProducts({
          category: selectedCategory,
          search: searchQuery,
        });
        setProducts(res);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    const newParams = new URLSearchParams(searchParams);
    if (categoryName && categoryName !== 'All') {
      newParams.set('category', categoryName);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSearchParams({});
  };

  const isFiltered = selectedCategory !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Full Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse premium gadgets, apparel, and footwear with instant dispatch
          </p>
        </div>

        {/* Results Counter and Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            {loading ? 'Searching...' : `Showing ${products.length} products`}
          </span>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Categories & Search Input */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
        {/* Category Pills */}
        <div className="flex-1 overflow-hidden">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Search Bar */}
        <div className="lg:w-80 shrink-0">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Search catalog by title..."
          />
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        emptyTitle={isFiltered ? 'No matching products found' : 'No products available'}
        emptyDescription={
          isFiltered
            ? `We couldn't find any products matching category "${selectedCategory}" and search "${searchQuery}".`
            : 'There are currently no products in the catalog.'
        }
        onResetFilters={isFiltered ? handleResetFilters : undefined}
      />
    </div>
  );
};

export default ProductsPage;
