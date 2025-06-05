import React from 'react';
import { Card } from '@/components/atoms/Card';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

export const ComingSoonSection = ({ title, description, icon }) => {
  return (
    <Card hoverEffect={false} className="flex flex-col items-center justify-center h-64">
      <div className="bg-surface-100 p-4 rounded-full mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-surface-400" />
      </div>
      <Heading level={3} className="text-xl mb-2">{title}</Heading>
      <Text className="text-surface-600 text-center max-w-md">{description}</Text>
    </Card>
  );
};