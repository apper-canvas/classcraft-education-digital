import testData from '../mockData/test.json'
import { delay } from '../index.js'

class TestService {
  constructor() {
    this.data = [...testData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(test => test.id === id)
    return item ? { ...item } : null
  }

  async create(test) {
    await delay(400)
    const newTest = {
      ...test,
      id: Date.now().toString(),
      scores: test.scores || []
    }
    this.data.push(newTest)
    return { ...newTest }
  }

  async update(id, testData) {
    await delay(350)
    const index = this.data.findIndex(test => test.id === id)
    if (index === -1) throw new Error('Test not found')
    
    this.data[index] = { ...this.data[index], ...testData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(test => test.id === id)
    if (index === -1) throw new Error('Test not found')
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async updateScore(testId, studentId, marksObtained) {
    await delay(200)
    const test = this.data.find(t => t.id === testId)
    if (!test) throw new Error('Test not found')

    const scoreIndex = test.scores.findIndex(s => s.studentId === studentId)
    if (scoreIndex === -1) {
      test.scores.push({ studentId, marksObtained })
    } else {
      test.scores[scoreIndex].marksObtained = marksObtained
    }

    return { ...test }
  }
}

export default new TestService()