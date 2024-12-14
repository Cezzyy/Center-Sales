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
  getDoc,
} from 'firebase/firestore'
import { LogService } from './logService'

export class OrderService {
  static async getOrders() {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(ordersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        amount: parseFloat(doc.data().amount || 0),
        quantity: parseInt(doc.data().quantity || 0),
      }))
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw new Error('Failed to fetch orders')
    }
  }

  static async addOrder(orderData) {
    try {
      const ordersRef = collection(db, 'orders')
      const newOrder = {
        ...orderData,
        amount: parseFloat(orderData.amount || 0),
        quantity: parseInt(orderData.quantity || 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(ordersRef, newOrder)
      await LogService.addLog({
        action: 'CREATE_ORDER',
        details: `Created order for ${orderData.customerName}`,
        username: orderData.salesRepresentative,
      })

      return {
        id: docRef.id,
        ...newOrder,
      }
    } catch (error) {
      console.error('Error adding order:', error)
      throw new Error('Failed to add order')
    }
  }

  static async updateOrder(orderId, orderData) {
    try {
      const orderRef = doc(db, 'orders', orderId)
      const updatedOrder = {
        ...orderData,
        amount: parseFloat(orderData.amount || 0),
        quantity: parseInt(orderData.quantity || 0),
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(orderRef, updatedOrder)
      await LogService.addLog({
        action: 'UPDATE_ORDER',
        details: `Updated order for ${orderData.customerName}`,
        username: orderData.salesRepresentative,
      })

      return {
        id: orderId,
        ...updatedOrder,
      }
    } catch (error) {
      console.error('Error updating order:', error)
      throw new Error('Failed to update order')
    }
  }

  static async deleteOrder(orderId, orderData) {
    try {
      // First check if the order has any associated invoices
      const invoicesRef = collection(db, 'invoices')
      const q = query(invoicesRef, where('orderId', '==', orderId))
      const invoiceSnapshot = await getDocs(q)

      if (!invoiceSnapshot.empty) {
        throw new Error('Cannot delete order with associated invoices')
      }

      const orderRef = doc(db, 'orders', orderId)
      await deleteDoc(orderRef)

      await LogService.addLog({
        action: 'DELETE_ORDER',
        details: `Deleted order for ${orderData.customerName}`,
        username: orderData.salesRepresentative,
        timestamp: new Date().toISOString(),
      })

      return true
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  }

  // Invoice Management
  static async getInvoices() {
    try {
      const invoicesRef = collection(db, 'invoices')
      const q = query(invoicesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          amount: parseFloat(data.amount || 0),
          isPaid: Boolean(data.isPaid), // Ensure isPaid is always a boolean
          status: data.status || 'pending',
        }
      })
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw new Error('Failed to fetch invoices')
    }
  }

  static async addInvoice(invoiceData) {
    try {
      const invoicesRef = collection(db, 'invoices')
      const newInvoice = {
        ...invoiceData,
        amount: parseFloat(invoiceData.amount || 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        isPaid: false,
        paidAt: null,
        paidBy: null,
      }

      const docRef = await addDoc(invoicesRef, newInvoice)
      await LogService.addLog({
        action: 'CREATE_INVOICE',
        details: `Created invoice for ${invoiceData.customerName}`,
        username: invoiceData.salesRepresentative,
      })

      return {
        id: docRef.id,
        ...newInvoice,
      }
    } catch (error) {
      console.error('Error adding invoice:', error)
      throw new Error('Failed to add invoice')
    }
  }

  static async updateInvoice(invoiceId, invoiceData) {
    try {
      const invoiceRef = doc(db, 'invoices', invoiceId)
      const invoiceDoc = await getDoc(invoiceRef)

      if (!invoiceDoc.exists()) {
        throw new Error('Invoice not found')
      }

      const currentData = invoiceDoc.data()
      if (currentData.isPaid) {
        throw new Error('Cannot update a paid invoice')
      }

      const updatedInvoice = {
        ...currentData,
        ...invoiceData,
        amount: parseFloat(invoiceData.amount || 0),
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(invoiceRef, updatedInvoice)

      await LogService.addLog({
        action: 'UPDATE_INVOICE',
        details: `Updated invoice for ${currentData.customerName}`,
        username: invoiceData.salesRepresentative,
        timestamp: new Date().toISOString(),
      })

      return {
        id: invoiceId,
        ...updatedInvoice,
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  }

  static async deleteInvoice(invoiceId, invoiceData) {
    if (!invoiceId) {
      throw new Error('Invoice ID is required')
    }

    try {
      const invoiceRef = doc(db, 'invoices', invoiceId)
      const invoiceDoc = await getDoc(invoiceRef)

      if (!invoiceDoc.exists()) {
        throw new Error('Invoice not found in database')
      }

      const currentInvoice = invoiceDoc.data()

      if (!currentInvoice) {
        throw new Error('Invalid invoice data')
      }

      if (currentInvoice.isPaid) {
        throw new Error('Cannot delete a paid invoice')
      }

      await deleteDoc(invoiceRef)

      await LogService.addLog({
        action: 'DELETE_INVOICE',
        details: `Deleted invoice for ${currentInvoice.customerName}`,
        username: invoiceData?.salesRepresentative || 'system',
        timestamp: new Date().toISOString(),
      })

      return true
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }

  static async markInvoiceAsPaid(invoiceId, invoiceData) {
    if (!invoiceId) {
      throw new Error('Invoice ID is required')
    }

    try {
      // Get the invoice document reference
      const invoiceRef = doc(db, 'invoices', invoiceId)

      // Check if invoice exists
      const invoiceDoc = await getDoc(invoiceRef)
      if (!invoiceDoc.exists()) {
        throw new Error('Invoice not found in database')
      }

      const currentInvoice = invoiceDoc.data()

      // Validate invoice data
      if (!currentInvoice) {
        throw new Error('Invalid invoice data')
      }

      // Check if already paid
      if (currentInvoice.isPaid) {
        throw new Error('Invoice is already marked as paid')
      }

      // Update invoice with paid status
      const updatedInvoice = {
        ...currentInvoice,
        isPaid: true,
        status: 'paid',
        paidAt: new Date().toISOString(),
        paidBy: invoiceData?.salesRepresentative || 'system',
        updatedAt: new Date().toISOString(),
      }

      // Save to database
      await updateDoc(invoiceRef, updatedInvoice)

      // Log the action
      await LogService.addLog({
        action: 'MARK_INVOICE_PAID',
        details: `Marked invoice ${invoiceId} as paid`,
        username: invoiceData?.salesRepresentative || 'system',
        timestamp: new Date().toISOString(),
      })

      // Return updated invoice data
      return {
        id: invoiceId,
        ...updatedInvoice,
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      throw error
    }
  }
}
