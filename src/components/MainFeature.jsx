import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns'
import ApperIcon from './ApperIcon'
import studentService from '../services/api/studentService'
import attendanceService from '../services/api/attendanceService'
import testService from '../services/api/testService'

const MainFeature = ({ section }) => {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTest, setSelectedTest] = useState(null)

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    parentPhone: '',
    address: '',
    batch: '',
    status: 'active'
  })

  const [testForm, setTestForm] = useState({
    name: '',
    subject: '',
    date: '',
    totalMarks: ''
  })

  useEffect(() => {
    loadData()
  }, [section])

  const loadData = async () => {
    setLoading(true)
    try {
      const [studentsData, attendanceData, testsData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        testService.getAll()
      ])
      setStudents(studentsData || [])
      setAttendance(attendanceData || [])
      setTests(testsData || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    if (!studentForm.name || !studentForm.email) {
      toast.error('Name and email are required')
      return
    }

    try {
      const newStudent = await studentService.create({
        ...studentForm,
        enrollmentDate: new Date().toISOString(),
        photo: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
      })
      setStudents(prev => [...prev, newStudent])
      setStudentForm({
        name: '',
        email: '',
        phone: '',
        parentPhone: '',
        address: '',
        batch: '',
        status: 'active'
      })
      setShowModal(false)
      toast.success('Student added successfully!')
    } catch (err) {
      toast.error('Failed to add student')
    }
  }

  const handleAddTest = async (e) => {
    e.preventDefault()
    if (!testForm.name || !testForm.subject || !testForm.date || !testForm.totalMarks) {
      toast.error('All fields are required')
      return
    }

    try {
      const newTest = await testService.create({
        ...testForm,
        totalMarks: parseInt(testForm.totalMarks),
        scores: students.map(student => ({
          studentId: student.id,
          marksObtained: 0
        }))
      })
      setTests(prev => [...prev, newTest])
      setTestForm({
        name: '',
        subject: '',
        date: '',
        totalMarks: ''
      })
      setShowModal(false)
      toast.success('Test created successfully!')
    } catch (err) {
      toast.error('Failed to create test')
    }
  }

  const handleAttendanceToggle = async (studentId, date, currentStatus) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present'
    const dateStr = format(date, 'yyyy-MM-dd')
    
    try {
      const existingRecord = attendance.find(
        a => a.studentId === studentId && a.date === dateStr
      )

      if (existingRecord) {
        const updated = await attendanceService.update(existingRecord.id, {
          ...existingRecord,
          status: newStatus
        })
        setAttendance(prev =>
          prev.map(a => a.id === existingRecord.id ? updated : a)
        )
      } else {
        const newRecord = await attendanceService.create({
          studentId,
          date: dateStr,
          status: newStatus,
          remarks: ''
        })
        setAttendance(prev => [...prev, newRecord])
      }
    } catch (err) {
      toast.error('Failed to update attendance')
    }
  }

  const handleScoreUpdate = async (testId, studentId, marks) => {
    try {
      const test = tests.find(t => t.id === testId)
      const updatedScores = test.scores.map(score =>
        score.studentId === studentId
          ? { ...score, marksObtained: parseInt(marks) || 0 }
          : score
      )

      const updatedTest = await testService.update(testId, {
        ...test,
        scores: updatedScores
      })

      setTests(prev => prev.map(t => t.id === testId ? updatedTest : t))
      toast.success('Score updated successfully!')
    } catch (err) {
      toast.error('Failed to update score')
    }
  }

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAttendanceForDate = (studentId, date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return attendance.find(a => a.studentId === studentId && a.date === dateStr)
  }

  const getGrade = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' }
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500' }
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-500' }
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400' }
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-500' }
    return { grade: 'F', color: 'text-red-500' }
  }

  const renderStudentsSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
          <ApperIcon name="UserPlus" className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={student.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face`}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-surface-900">{student.name}</h3>
                  <p className="text-sm text-surface-600">{student.batch || 'No batch assigned'}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <ApperIcon name="Mail" className="h-4 w-4 text-surface-400 mr-2" />
                  <span className="text-surface-600">{student.email}</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Phone" className="h-4 w-4 text-surface-400 mr-2" />
                  <span className="text-surface-600">{student.phone || 'No phone'}</span>
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
                  <button className="p-1 hover:bg-surface-100 rounded">
                    <ApperIcon name="Edit" className="h-4 w-4 text-surface-400" />
                  </button>
                  <button className="p-1 hover:bg-surface-100 rounded">
                    <ApperIcon name="Trash2" className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={studentForm.batch}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, batch: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const renderAttendanceSection = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="p-2 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="ChevronLeft" className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-surface-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="p-2 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="ChevronRight" className="h-5 w-5" />
            </button>
          </div>
          <div className="text-sm text-surface-600">
            Click on dates to mark attendance
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-surface-700 sticky left-0 bg-surface-50 z-10 min-w-[160px]">
                    Student
                  </th>
                  {daysInMonth.slice(0, 15).map(day => (
                    <th key={day.toString()} className="px-2 py-3 text-center text-sm font-medium text-surface-700 min-w-[40px]">
                      <div className={`${isToday(day) ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                        {format(day, 'd')}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3 sticky left-0 bg-white z-10 border-r border-surface-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face`}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-surface-900">{student.name}</span>
                      </div>
                    </td>
                    {daysInMonth.slice(0, 15).map(day => {
                      const attendanceRecord = getAttendanceForDate(student.id, day)
                      const status = attendanceRecord?.status || 'unmarked'
                      
                      return (
                        <td key={day.toString()} className="px-2 py-3 text-center">
                          <button
                            onClick={() => handleAttendanceToggle(student.id, day, status)}
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                              status === 'present'
                                ? 'bg-secondary border-secondary'
                                : status === 'absent'
                                ? 'bg-red-500 border-red-500'
                                : 'border-surface-300 hover:border-surface-400'
                            }`}
                          >
                            {status === 'present' && (
                              <ApperIcon name="Check" className="h-3 w-3 text-white mx-auto" />
                            )}
                            {status === 'absent' && (
                              <ApperIcon name="X" className="h-3 w-3 text-white mx-auto" />
                            )}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderTestsSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-surface-900">Tests & Scores</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Create Test
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map(test => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-surface-900">{test.name}</h4>
                <p className="text-sm text-surface-600">{test.subject} • {format(new Date(test.date), 'MMM d, yyyy')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-surface-600">Total Marks</p>
                <p className="font-semibold text-surface-900">{test.totalMarks}</p>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {students.map(student => {
                const score = test.scores?.find(s => s.studentId === student.id)
                const gradeInfo = score ? getGrade(score.marksObtained, test.totalMarks) : null

                return (
                  <div key={student.id} className="flex items-center justify-between p-2 hover:bg-surface-50 rounded">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face`}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-surface-900">{student.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="0"
                        max={test.totalMarks}
                        value={score?.marksObtained || ''}
                        onChange={(e) => handleScoreUpdate(test.id, student.id, e.target.value)}
                        className="w-16 px-2 py-1 text-sm border border-surface-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                      />
                      <span className="text-sm text-surface-600">/ {test.totalMarks}</span>
                      {gradeInfo && (
                        <span className={`text-sm font-medium ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Test Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Create New Test</h3>
              <form onSubmit={handleAddTest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Test Name *</label>
                  <input
                    type="text"
                    value={testForm.name}
                    onChange={(e) => setTestForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={testForm.subject}
                    onChange={(e) => setTestForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={testForm.date}
                    onChange={(e) => setTestForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Total Marks *</label>
                  <input
                    type="number"
                    min="1"
                    value={testForm.totalMarks}
                    onChange={(e) => setTestForm(prev => ({ ...prev, totalMarks: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Create Test
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Retry
        </button>
      </div>
    )
  }

  switch (section) {
    case 'students':
      return renderStudentsSection()
    case 'attendance':
      return renderAttendanceSection()
    case 'tests':
      return renderTestsSection()
    default:
      return <div>Section not found</div>
  }
}

export default MainFeature