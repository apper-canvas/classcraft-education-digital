import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import studentService from '../services/api/studentService'
import attendanceService from '../services/api/attendanceService'
import testService from '../services/api/testService'

const Home = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    upcomingTests: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoading(true)
      try {
        const [students, attendance, tests] = await Promise.all([
          studentService.getAll(),
          attendanceService.getAll(),
          testService.getAll()
        ])

        const today = new Date().toDateString()
        const todayAttendance = attendance.filter(a => 
          new Date(a.date).toDateString() === today && a.status === 'present'
        )

        const upcomingTests = tests.filter(test => 
          new Date(test.date) > new Date()
        )

        setStats({
          totalStudents: students.length,
          todayAttendance: students.length > 0 ? Math.round((todayAttendance.length / students.length) * 100) : 0,
          upcomingTests: upcomingTests.length
        })
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardStats()
  }, [])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', active: true },
    { id: 'students', label: 'Students', icon: 'Users' },
    { id: 'attendance', label: 'Attendance', icon: 'Calendar' },
    { id: 'tests', label: 'Tests & Scores', icon: 'BarChart3' },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: 'FileText', 
      badge: 'Coming Soon!',
      disabled: true 
    },
    { 
      id: 'materials', 
      label: 'Study Materials', 
      icon: 'BookOpen', 
      badge: 'Next Month',
      disabled: true 
    },
    { 
      id: 'batches', 
      label: 'Batches', 
      icon: 'Group', 
      badge: 'In Dev',
      disabled: true 
    },
    { 
      id: 'fees', 
      label: 'Fee Management', 
      icon: 'CreditCard', 
      badge: 'Q2 2024',
      disabled: true 
    }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 lg:p-6 shadow-card hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Total Students</p>
              <p className="text-2xl lg:text-3xl font-bold text-surface-900 mt-1">
                {loading ? '...' : stats.totalStudents}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <ApperIcon name="Users" className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 lg:p-6 shadow-card hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Today's Attendance</p>
              <p className="text-2xl lg:text-3xl font-bold text-secondary mt-1">
                {loading ? '...' : `${stats.todayAttendance}%`}
              </p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-lg">
              <ApperIcon name="UserCheck" className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 lg:p-6 shadow-card hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Upcoming Tests</p>
              <p className="text-2xl lg:text-3xl font-bold text-accent mt-1">
                {loading ? '...' : stats.upcomingTests}
              </p>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg">
              <ApperIcon name="FileText" className="h-6 w-6 text-accent" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-4 lg:p-6 shadow-card"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveSection('students')}
            className="flex items-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
          >
            <ApperIcon name="UserPlus" className="h-5 w-5 text-primary mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-surface-700">Add Student</span>
          </button>
          <button
            onClick={() => setActiveSection('attendance')}
            className="flex items-center p-4 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-all duration-200 group"
          >
            <ApperIcon name="Calendar" className="h-5 w-5 text-secondary mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-surface-700">Mark Attendance</span>
          </button>
          <button
            onClick={() => setActiveSection('tests')}
            className="flex items-center p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-all duration-200 group"
          >
            <ApperIcon name="Plus" className="h-5 w-5 text-accent mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-surface-700">Create Test</span>
          </button>
          <button className="flex items-center p-4 bg-surface-100 rounded-lg hover:bg-surface-200 transition-all duration-200 group">
            <ApperIcon name="BarChart3" className="h-5 w-5 text-surface-500 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-surface-700">View Reports</span>
          </button>
        </div>
      </motion.div>
    </div>
  )

  const renderComingSoon = (title, description, icon) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-card"
    >
      <div className="bg-surface-100 p-4 rounded-full mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-surface-400" />
      </div>
      <h3 className="text-xl font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 text-center max-w-md">{description}</p>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'students':
      case 'attendance':
      case 'tests':
        return <MainFeature section={activeSection} />
      case 'assignments':
        return renderComingSoon('Assignments Hub', 'Create and manage assignments with deadline tracking and submission status.', 'FileText')
      case 'materials':
        return renderComingSoon('Resource Library', 'Upload and organize study materials for easy student access.', 'BookOpen')
      case 'batches':
        return renderComingSoon('Batch Management', 'Organize students into batches and manage batch-specific activities.', 'Group')
      case 'fees':
        return renderComingSoon('Payment Tracking', 'Track fee payments, send reminders, and generate invoices.', 'CreditCard')
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-surface-50">
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
            <button
              key={item.id}
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
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-surface-200 px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 p-2 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="Menu" className="h-6 w-6 text-surface-600" />
            </button>
            <h2 className="text-xl lg:text-2xl font-semibold text-surface-900 capitalize">
              {activeSection === 'tests' ? 'Tests & Scores' : activeSection}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-surface-100 rounded-lg relative">
              <ApperIcon name="Bell" className="h-6 w-6 text-surface-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">T</span>
            </div>
          </div>
        </header>

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
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home