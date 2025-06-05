import React from 'react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { Text } from '@/components/atoms/Text';

export const SidebarMenuItem = ({ item, activeSection, setActiveSection }) => {
  return (
    <Button
      onClick={() => !item.disabled && setActiveSection(item.id)}
      disabled={item.disabled}
      className={`w-full flex items-center justify-between px-3 py-3 mb-1 rounded-lg transition-all duration-200 text-left ${
        activeSection === item.id
          ? 'bg-white/20 text-white shadow-lg'
          : item.disabled
          ? 'text-white/50 cursor-not-allowed'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <div className="flex items-center">
        <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
        <Text className="font-medium">{item.label}</Text>
      </div>
      {item.badge && <Badge>{item.badge}</Badge>}
    </Button>
  );
};