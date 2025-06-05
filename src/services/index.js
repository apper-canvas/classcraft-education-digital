export { default as studentService } from './api/studentService.js'
export { default as attendanceService } from './api/attendanceService.js'
export { default as testService } from './api/testService.js'
export { default as assignmentService } from './api/assignmentService.js'

// Utility function for simulating API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))