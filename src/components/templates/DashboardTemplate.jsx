import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MainHeader } from '@/components/organisms/MainHeader';
import { useState } from 'react';
import { SidebarMenuItem } from '@/components/molecules/SidebarMenuItem';
import ApperIcon from '@/components/ApperIcon';
import { Text } from '@/components/atoms/Text';

export const DashboardTemplate = ({ activeSection, children, menuItems, setActiveSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%'
        }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-dark to-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-primary-light/20">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ClassCraft</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/10 p-1 rounded"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              activeSection={activeSection}
              setActiveSection={(section) => {
                setActiveSection(section);
                setSidebarOpen(false); // Close sidebar on item click for mobile
              }}
            />
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainHeader
          activeSection={activeSection}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
};