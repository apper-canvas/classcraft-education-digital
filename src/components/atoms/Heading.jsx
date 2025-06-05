import React from 'react';

export const Heading = ({ level, children, className = '' }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={`font-semibold text-surface-900 ${className}`}>
      {children}
    </Tag>
  );
};