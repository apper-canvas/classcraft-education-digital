import React from 'react';

export const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  required = false,
  min,
  max,
  step
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      required={required}
      min={min}
      max={max}
      step={step}
    />
  );
};