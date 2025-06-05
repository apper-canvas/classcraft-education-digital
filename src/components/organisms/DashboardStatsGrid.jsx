import React from 'react';
import { StatCard } from '@/components/molecules/StatCard';

export const DashboardStatsGrid = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        icon="Users"
        iconBgColor="bg-primary/10"
        iconColor="text-primary"
        valueColor="text-surface-900"
        delay={0.1}
        loading={loading}
      />
      <StatCard
        title="Today's Attendance"
        value={`${stats.todayAttendance}%`}
        icon="UserCheck"
        iconBgColor="bg-secondary/10"
        iconColor="text-secondary"
        valueColor="text-secondary"
        delay={0.2}
        loading={loading}
      />
      <StatCard
        title="Upcoming Tests"
        value={stats.upcomingTests}
        icon="FileText"
        iconBgColor="bg-accent/10"
        iconColor="text-accent"
        valueColor="text-accent"
        delay={0.3}
        loading={loading}
      />
    </div>
  );
};