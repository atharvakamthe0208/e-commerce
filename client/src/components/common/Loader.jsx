import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = 'Loading...', size = 'default' }) => {
  const spinnerSize = size === 'small' ? 'w-5 h-5' : size === 'large' ? 'w-12 h-12' : 'w-8 h-8';

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-slate-600">
      <Loader2 className={`${spinnerSize} animate-spin text-indigo-600`} />
      {text && <p className="mt-3 text-sm font-medium text-slate-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
};

export default Loader;
