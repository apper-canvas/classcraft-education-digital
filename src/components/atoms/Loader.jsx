import React from 'react';

export const Loader = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};