import { db } from '@/firebase/firebaseconfig'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore'
import { LogService } from './logService'

export class ReportService {
  static async getReports() {
    try {
      const reportsRef = collection(db, 'reports')
      const q = query(reportsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
        amount: parseFloat(doc.data().amount || 0),
        date: doc.data().date?.toDate().toISOString() || new Date().toISOString(),
      }))
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw new Error('Failed to fetch reports')
    }
  }

  static async getReportsByDateRange(startDate, endDate) {
    try {
      const reportsRef = collection(db, 'reports')
      const start = new Date(startDate)
      const end = new Date(endDate)

      const q = query(
        reportsRef,
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end)),
        orderBy('date', 'desc'),
      )

      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
        amount: parseFloat(doc.data().amount || 0),
        date: doc.data().date?.toDate().toISOString() || new Date().toISOString(),
      }))
    } catch (error) {
      console.error('Error fetching reports by date range:', error)
      throw new Error('Failed to fetch reports for the specified date range')
    }
  }

  static async addReport(reportData) {
    try {
      const reportsRef = collection(db, 'reports')

      // Check for existing report with the same orderId
      const existingReportQuery = query(reportsRef, where('orderId', '==', reportData.orderId))
      const existingReportSnapshot = await getDocs(existingReportQuery)

      if (!existingReportSnapshot.empty) {
        throw new Error('A report for this order already exists')
      }

      const newReport = {
        ...reportData,
        amount: parseFloat(reportData.amount || 0),
        date: Timestamp.fromDate(new Date(reportData.date || new Date())),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: reportData.status || 'Pending',
      }

      const docRef = await addDoc(reportsRef, newReport)

      await LogService.addLog({
        action: 'CREATE_REPORT',
        details: `Created report for ${reportData.customerName || 'Unknown Customer'}`,
        username: reportData.createdBy || 'System',
      })

      return {
        reportId: docRef.id,
        ...newReport,
        date: newReport.date.toDate().toISOString(),
      }
    } catch (error) {
      console.error('Error adding report:', error)
      throw error // Throw the original error to preserve the message
    }
  }

  static async updateReport(reportId, reportData) {
    try {
      if (!reportId) {
        throw new Error('Report ID is required')
      }

      // First check if the document exists
      const reportRef = doc(db, 'reports', reportId)

      // Format the data before updating
      const updatedReport = {
        customerName: reportData.customerName?.trim() || '',
        productName: reportData.productName?.trim() || '',
        orderId: reportData.orderId,
        quantity: parseInt(reportData.quantity) || 0,
        amount: parseFloat(reportData.amount) || 0,
        salesRep: reportData.salesRep?.trim() || '',
        status: reportData.status || 'pending',
        paymentStatus: reportData.paymentStatus || 'pending',
      }

      // Handle date fields
      try {
        updatedReport.date = Timestamp.fromDate(new Date(reportData.date))
        updatedReport.dueDate = Timestamp.fromDate(new Date(reportData.dueDate))
        updatedReport.orderDate = Timestamp.fromDate(new Date(reportData.orderDate))
      } catch (error) {
        throw new Error('Invalid date format')
      }

      updatedReport.updatedAt = Timestamp.now()

      // Validate required fields
      const requiredFields = [
        'customerName',
        'productName',
        'quantity',
        'amount',
        'salesRep',
        'status',
        'paymentStatus',
      ]

      for (const field of requiredFields) {
        if (!updatedReport[field]) {
          throw new Error(`${field} is required`)
        }
      }

      // Update the document
      await updateDoc(reportRef, updatedReport)

      // Log the action
      await LogService.addLog({
        action: 'UPDATE_REPORT',
        details: `Updated report ${reportId}`,
        username: reportData.updatedBy || 'System',
      })

      // Return the formatted data
      return {
        reportId,
        ...updatedReport,
        date: updatedReport.date.toDate().toISOString(),
        dueDate: updatedReport.dueDate.toDate().toISOString(),
        orderDate: updatedReport.orderDate.toDate().toISOString(),
      }
    } catch (error) {
      console.error('Error updating report:', error)
      if (error.code === 'not-found') {
        throw new Error(`Report with ID ${reportId} not found`)
      }
      throw error
    }
  }

  static async deleteReport(reportId) {
    try {
      const reportRef = doc(db, 'reports', reportId)
      await deleteDoc(reportRef)

      await LogService.addLog({
        action: 'DELETE_REPORT',
        details: `Deleted report ${reportId}`,
        username: 'System',
      })

      return true
    } catch (error) {
      console.error('Error deleting report:', error)
      throw new Error('Failed to delete report')
    }
  }

  static async getReportsByOrder(orderId) {
    try {
      const reportsRef = collection(db, 'reports')
      const q = query(reportsRef, where('orderId', '==', orderId))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        reportId: doc.id,
        ...doc.data(),
        amount: parseFloat(doc.data().amount || 0),
        date: doc.data().date?.toDate().toISOString() || new Date().toISOString(),
      }))
    } catch (error) {
      console.error('Error fetching reports by order:', error)
      throw new Error('Failed to fetch reports for the specified order')
    }
  }
}
