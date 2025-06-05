import React from 'react';

export const Text = ({ children, className = '' }) => {
  return (
    <p className={className}>
      {children}
    </p>
  );
};