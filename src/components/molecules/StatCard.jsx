import React from 'react';
import { Card } from '@/components/atoms/Card';
import { Text } from '@/components/atoms/Text';
import { Heading } from '@/components/atoms/Heading';
import ApperIcon from '@/components/ApperIcon';

export const StatCard = ({ title, value, icon, iconBgColor, iconColor, valueColor, delay, loading }) => {
  return (
    <Card delay={delay}>
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-surface-600 text-sm font-medium">{title}</Text>
          <Heading level={2} className={`text-2xl lg:text-3xl font-bold mt-1 ${valueColor}`}>
            {loading ? '...' : value}
          </Heading>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <ApperIcon name={icon} className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
};