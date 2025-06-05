import React from 'react';
import { Button } from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { Text } from '@/components/atoms/Text';

export const QuickActionButton = ({ icon, label, onClick, className = '' }) => {
  return (
    <Button
      onClick={onClick}
      className={`flex items-center p-4 rounded-lg group ${className}`}
    >
      <ApperIcon name={icon} className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
      <Text className="text-sm font-medium text-surface-700">{label}</Text>
    </Button>
  );
};