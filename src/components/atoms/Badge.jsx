import React from 'react';
import { Text } from '@/components/atoms/Text';

export const Badge = ({ children, className = '' }) => {
  return (
    <Text className={`bg-accent text-white text-xs px-2 py-1 rounded-full ${className}`}>
      {children}
    </Text>
  );
};