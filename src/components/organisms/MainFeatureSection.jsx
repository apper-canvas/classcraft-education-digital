import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import studentService from '@/services/api/studentService'
import attendanceService from '@/services/api/attendanceService'
import testService from '@/services/api/testService'
import { Loader } from '@/components/atoms/Loader'
import { Button } from '@/components/atoms/Button'
import { StudentList } from '@/components/organisms/StudentList'
import { StudentFormModal } from '@/components/organisms/StudentFormModal'
import { AttendanceTable } from '@/components/organisms/AttendanceTable'
import { TestScoresList } from '@/components/organisms/TestScoresList'
import { TestFormModal } from '@/components/organisms/TestFormModal'

export const MainFeatureSection = ({ section }) => {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')

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
    setError(null)
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

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Retry
        </Button>
      </div>
    )
  }

  switch (section) {
    case 'students':
      return (
        <>
          <StudentList
            students={filteredStudents}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddStudent={() => setShowModal(true)}
          />
          <StudentFormModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleAddStudent}
            formState={studentForm}
            setFormState={setStudentForm}
          />
        </>
      )
    case 'attendance':
      return (
        <AttendanceTable
          students={students}
          attendance={attendance}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          handleAttendanceToggle={handleAttendanceToggle}
        />
      )
    case 'tests':
      return (
        <>
          <TestScoresList
            tests={tests}
            students={students}
            handleScoreUpdate={handleScoreUpdate}
            onCreateTest={() => setShowModal(true)}
          />
          <TestFormModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleAddTest}
            formState={testForm}
            setFormState={setTestForm}
          />
        </>
      )
    default:
      return <div>Section not found</div>
  }
}