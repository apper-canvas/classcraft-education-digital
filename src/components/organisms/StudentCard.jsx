import React from 'react';
import { Card } from '@/components/atoms/Card';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

export const StudentCard = ({ student, index }) => {
  return (
    <Card delay={index * 0.1} className="group">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={student.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face`}
          alt={student.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <Heading level={3} className="font-semibold">{student.name}</Heading>
          <Text className="text-sm text-surface-600">{student.batch || 'No batch assigned'}</Text>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <ApperIcon name="Mail" className="h-4 w-4 text-surface-400 mr-2" />
          <Text className="text-surface-600">{student.email}</Text>
        </div>
        <div className="flex items-center">
          <ApperIcon name="Phone" className="h-4 w-4 text-surface-400 mr-2" />
          <Text className="text-surface-600">{student.phone || 'No phone'}</Text>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100">
        <span className={`px-2 py-1 text-xs rounded-full ${
          student.status === 'active' 
            ? 'bg-secondary/10 text-secondary' 
            : 'bg-red-100 text-red-600'
        }`}>
          {student.status}
        </span>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="p-1 hover:bg-surface-100 rounded">
            <ApperIcon name="Edit" className="h-4 w-4 text-surface-400" />
          </Button>
          <Button className="p-1 hover:bg-surface-100 rounded">
            <ApperIcon name="Trash2" className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
};