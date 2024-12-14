import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Orders API
export const ordersAPI = {
  getAllOrders: async () => {
    try {
      const { data } = await api.get('/orders')
      return data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  createOrder: async (orderData) => {
    try {
      const { data } = await api.post('/orders', orderData)
      return data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },
}

// Invoices API
export const invoicesAPI = {
  getAllInvoices: async () => {
    try {
      const { data } = await api.get('/invoices')
      return data
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw error
    }
  },

  createInvoice: async (invoiceData) => {
    try {
      const { data } = await api.post('/invoices', invoiceData)
      return data
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  },

  updateInvoice: async (id, invoiceData) => {
    try {
      const { data } = await api.patch(`/invoices/${id}`, invoiceData)
      return data
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  },
}

// Products API
export const productsAPI = {
  getAllProducts: async () => {
    try {
      const { data } = await api.get('/products')
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  createProduct: async (productData) => {
    try {
      const { data } = await api.post('/products', productData)
      return data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData)
      return data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },
}

// Clients API
export const clientsAPI = {
  getAllClients: async () => {
    try {
      const { data } = await api.get('/clients')
      return data
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  },

  createClient: async (clientData) => {
    try {
      const { data } = await api.post('/clients', clientData)
      return data
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const { data } = await api.put(`/clients/${id}`, clientData)
      return data
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  },

  deleteClient: async (id) => {
    try {
      await api.delete(`/clients/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  },
}
