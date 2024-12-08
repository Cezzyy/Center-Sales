import { LogService } from '../services/logService'
import { useAuthStore } from '../stores/authStore'

export function useActivityLog() {
  const logAction = async ({ action, category, details, targetId = null, additionalData = {} }) => {
    try {
      const authStore = useAuthStore()
      const user = authStore.currentUser

      if (!user || !user.id) {
        console.error('No authenticated user found when trying to log action:', {
          action,
          category,
          details,
        })
        return null
      }

      // Ensure we have all required user data
      const logData = {
        userId: user.id,
        username: user.username || user.name || 'Unknown User',
        userRole: user.role || 'user',
        position: user.position || 'Unknown Position',
        action,
        category,
        details,
        targetId,
        ...additionalData,
      }

      console.log('Creating log entry:', logData)

      // Add the log entry
      const result = await LogService.addLog(logData)
      console.log('Log entry created:', result)

      return result
    } catch (error) {
      console.error('Failed to log action:', error, { action, category, details })
      return null
    }
  }

  const logUserAction = async (action, details, userId = null) => {
    console.log('Logging user action:', { action, details, userId })
    return logAction({
      action,
      category: 'user',
      details,
      targetId: userId,
    })
  }

  const logClientAction = async (action, details, clientId = null) => {
    console.log('Logging client action:', { action, details, clientId })
    return logAction({
      action,
      category: 'client',
      details,
      targetId: clientId,
    })
  }

  const logSaleAction = async (action, details, saleId = null) => {
    console.log('Logging sale action:', { action, details, saleId })
    return logAction({
      action,
      category: 'sale',
      details,
      targetId: saleId,
    })
  }

  const logInvoiceAction = async (action, details, invoiceId = null) => {
    console.log('Logging invoice action:', { action, details, invoiceId })
    return logAction({
      action,
      category: 'invoice',
      details,
      targetId: invoiceId,
    })
  }

  return {
    logAction,
    logUserAction,
    logClientAction,
    logSaleAction,
    logInvoiceAction,
  }
}
