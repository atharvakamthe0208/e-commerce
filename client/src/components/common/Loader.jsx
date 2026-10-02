import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
      <p className="text-slate-600 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle animate-pulse flex flex-col h-full">
      <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
      <div className="h-5 bg-slate-200 rounded w-4/5 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-full mb-4" />
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-9 bg-slate-200 rounded-lg w-28" />
      </div>
    </div>
  );
};

export default Loader;
