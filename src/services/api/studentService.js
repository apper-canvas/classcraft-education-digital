import studentData from '../mockData/student.json'
import { delay } from '../index.js'

class StudentService {
  constructor() {
    this.data = [...studentData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(student => student.id === id)
    return item ? { ...item } : null
  }

  async create(student) {
    await delay(400)
    const newStudent = {
      ...student,
      id: Date.now().toString(),
      enrollmentDate: student.enrollmentDate || new Date().toISOString()
    }
    this.data.push(newStudent)
    return { ...newStudent }
  }

  async update(id, studentData) {
    await delay(350)
    const index = this.data.findIndex(student => student.id === id)
    if (index === -1) throw new Error('Student not found')
    
    this.data[index] = { ...this.data[index], ...studentData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(student => student.id === id)
    if (index === -1) throw new Error('Student not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new StudentService()