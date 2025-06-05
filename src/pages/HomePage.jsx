import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import studentService from '@/services/api/studentService'
import attendanceService from '@/services/api/attendanceService'
import testService from '@/services/api/testService'
import { PageLayout } from '@/components/templates/PageLayout'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { DashboardStatsGrid } from '@/components/organisms/DashboardStatsGrid'
import { DashboardQuickActions } from '@/components/organisms/DashboardQuickActions'
import { MainFeatureSection } from '@/components/organisms/MainFeatureSection'
import { ComingSoonSection } from '@/components/organisms/ComingSoonSection'
const HomePage = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
const renderDashboard = () => (
    <div className="space-y-6">
      <DashboardStatsGrid stats={stats} loading={loading} />
      <DashboardQuickActions setActiveSection={setActiveSection} />
    </div>
  )
switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'students':
      case 'attendance':
      case 'tests':
        return <MainFeatureSection section={activeSection} />
      case 'assignments':
        return <ComingSoonSection title="Assignments Hub" description="Create and manage assignments with deadline tracking and submission status." icon="FileText" />
      case 'materials':
        return <ComingSoonSection title="Resource Library" description="Upload and organize study materials for easy student access." icon="BookOpen" />
      case 'batches':
        return <ComingSoonSection title="Batch Management" description="Organize students into batches and manage batch-specific activities." icon="Group" />
      case 'fees':
        return <ComingSoonSection title="Payment Tracking" description="Track fee payments, send reminders, and generate invoices." icon="CreditCard" />
      default:
        return renderDashboard()
return (
    <PageLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      menuItems={menuItems}
    >
      <DashboardTemplate
        activeSection={activeSection}
      >
        {renderContent()}
      </DashboardTemplate>
    </PageLayout>
  )
export default HomePage