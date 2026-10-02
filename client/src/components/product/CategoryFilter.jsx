import React from 'react';
import { Layers, Smartphone, Shirt, Footprints } from 'lucide-react';

const CATEGORY_ICONS = {
  All: Layers,
  Electronics: Smartphone,
  Fashion: Shirt,
  Shoes: Footprints,
};

export const CategoryFilter = ({
  categories = ['All', 'Electronics', 'Fashion', 'Shoes'],
  selectedCategory = 'All',
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
      {categories.map((cat) => {
        const catName = typeof cat === 'object' ? cat.name : cat;
        const catId = typeof cat === 'object' ? cat._id || cat.name : cat;
        const isSelected =
          selectedCategory === catName ||
          selectedCategory === catId ||
          (selectedCategory === 'All' && catName === 'All');

        const Icon = CATEGORY_ICONS[catName] || Layers;

        return (
          <button
            key={catId}
            type="button"
            onClick={() => onSelectCategory(catName)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
                : 'bg-white text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 shadow-subtle'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{catName}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
