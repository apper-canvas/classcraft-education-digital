import assignmentData from '../mockData/assignment.json'
import { delay } from '../index.js'

class AssignmentService {
  constructor() {
    this.data = [...assignmentData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(assignment => assignment.id === id)
    return item ? { ...item } : null
  }

  async create(assignment) {
    await delay(400)
    const newAssignment = {
      ...assignment,
      id: Date.now().toString(),
      submissions: assignment.submissions || []
    }
    this.data.push(newAssignment)
    return { ...newAssignment }
  }

  async update(id, assignmentData) {
    await delay(350)
    const index = this.data.findIndex(assignment => assignment.id === id)
    if (index === -1) throw new Error('Assignment not found')
    
    this.data[index] = { ...this.data[index], ...assignmentData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(assignment => assignment.id === id)
    if (index === -1) throw new Error('Assignment not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new AssignmentService()