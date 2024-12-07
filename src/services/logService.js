// Mock database/storage for logs (replace with actual database implementation)
// Constants
const LOGS_STORAGE_KEY = 'logs'

// In-memory logs array
let logs = []

// Load initial logs from localStorage
try {
  const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY)
  if (storedLogs) {
    logs = JSON.parse(storedLogs)
    console.log('Initial logs loaded:', logs)
  }
} catch (error) {
  console.error('Failed to load initial logs:', error)
}

export class LogService {
  static async addLog(logData) {
    try {
      console.log('Adding log:', logData)
      
      const log = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...logData,
      }
      
      // Add to beginning of array
      logs.unshift(log)
      
      // Keep only last 1000 logs
      if (logs.length > 1000) {
        logs = logs.slice(0, 1000)
      }
      
      // Save to localStorage
      const logsString = JSON.stringify(logs)
      localStorage.setItem(LOGS_STORAGE_KEY, logsString)
      
      // Verify save
      const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY)
      console.log('Logs saved:', JSON.parse(savedLogs))
      
      return log
    } catch (error) {
      console.error('Failed to add log:', error)
      return null
    }
  }

  static async getLogs(filters = {}) {
    try {
      console.log('Getting logs with filters:', filters)
      
      // Get fresh logs from localStorage
      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY)
      logs = storedLogs ? JSON.parse(storedLogs) : []
      console.log('Retrieved logs:', logs)
      
      let filteredLogs = [...logs]
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate)
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate)
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate)
      }
      
      return filteredLogs
    } catch (error) {
      console.error('Failed to get logs:', error)
      return []
    }
  }

  static async clearLogs() {
    try {
      logs = []
      localStorage.setItem(LOGS_STORAGE_KEY, '[]')
      console.log('Logs cleared')
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }
}
