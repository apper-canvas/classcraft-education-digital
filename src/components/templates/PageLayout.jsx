import React from 'react';
import { DashboardTemplate } from '@/components/templates/DashboardTemplate';

export const PageLayout = ({ activeSection, setActiveSection, menuItems, children }) => {
  return (
    <div className="flex h-screen bg-surface-50">
      <DashboardTemplate
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
      >
        {children}
      </DashboardTemplate>
    </div>
  );
};