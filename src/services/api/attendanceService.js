import attendanceData from '../mockData/attendance.json'
import { delay } from '../index.js'

class AttendanceService {
  constructor() {
    this.data = [...attendanceData]
  }

  async getAll() {
    await delay(250)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(record => record.id === id)
    return item ? { ...item } : null
  }

  async create(record) {
    await delay(300)
    const newRecord = {
      ...record,
      id: Date.now().toString()
    }
    this.data.push(newRecord)
    return { ...newRecord }
  }

  async update(id, recordData) {
    await delay(250)
    const index = this.data.findIndex(record => record.id === id)
    if (index === -1) throw new Error('Attendance record not found')
    
    this.data[index] = { ...this.data[index], ...recordData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.data.findIndex(record => record.id === id)
    if (index === -1) throw new Error('Attendance record not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async getByStudentId(studentId) {
    await delay(200)
    return this.data.filter(record => record.studentId === studentId)
  }

  async getByDate(date) {
    await delay(200)
    return this.data.filter(record => record.date === date)
  }
}

export default new AttendanceService()