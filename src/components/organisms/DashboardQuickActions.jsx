import React from 'react';
import { Card } from '@/components/atoms/Card';
import { Heading } from '@/components/atoms/Heading';
import { QuickActionButton } from '@/components/molecules/QuickActionButton';

export const DashboardQuickActions = ({ setActiveSection }) => {
  return (
    <Card delay={0.4} hoverEffect={false}>
      <Heading level={3} className="text-lg mb-4">Quick Actions</Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton
          icon="UserPlus"
          label="Add Student"
          onClick={() => setActiveSection('students')}
          className="bg-primary/5 hover:bg-primary/10"
        />
        <QuickActionButton
          icon="Calendar"
          label="Mark Attendance"
          onClick={() => setActiveSection('attendance')}
          className="bg-secondary/5 hover:bg-secondary/10"
        />
        <QuickActionButton
          icon="Plus"
          label="Create Test"
          onClick={() => setActiveSection('tests')}
          className="bg-accent/5 hover:bg-accent/10"
        />
        <QuickActionButton
          icon="BarChart3"
          label="View Reports"
          onClick={() => { /* Implement report view logic */ }}
          className="bg-surface-100 hover:bg-surface-200"
        />
      </div>
    </Card>
  );
};