import React from 'react';

const CategoryFilter = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`rounded-full px-4 py-2 text-xs font-bold transition shrink-0 ${
          selectedCategory === 'all'
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        All Categories
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat._id || selectedCategory === cat.name;
        return (
          <button
            key={cat._id}
            type="button"
            onClick={() => onSelectCategory(cat._id)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition shrink-0 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
