import React from 'react';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import ApperIcon from '@/components/ApperIcon';
import { Text } from '@/components/atoms/Text';

export const MainHeader = ({ activeSection, onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-surface-200 px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          onClick={onToggleSidebar}
          className="lg:hidden mr-4 p-2 hover:bg-surface-100 rounded-lg"
        >
          <ApperIcon name="Menu" className="h-6 w-6 text-surface-600" />
        </Button>
        <Heading level={2} className="text-xl lg:text-2xl capitalize">
          {activeSection === 'tests' ? 'Tests & Scores' : activeSection}
        </Heading>
      </div>
      <div className="flex items-center space-x-4">
        <Button className="p-2 hover:bg-surface-100 rounded-lg relative">
          <ApperIcon name="Bell" className="h-6 w-6 text-surface-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
        </Button>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Text className="text-white font-medium text-sm">T</Text>
        </div>
      </div>
    </header>
  );
};