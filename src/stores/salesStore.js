import { defineStore } from 'pinia'
import { OrderService } from '@/services/orderService'

export const useOrderInvoiceStore = defineStore('orderInvoice', {
  state: () => ({
    // Modals
    isAddSalesModalOpen: false,
    isAddInvoiceModalOpen: false,
    isViewOrderModalOpen: false,
    isEditOrderModalOpen: false,
    isEditInvoiceModalOpen: false,
    isLoading: false,
    error: null,

    // Data for modals
    viewOrder: null,
    editOrder: null,
    editInvoice: null,

    // Orders and Invoices
    orders: [],
    invoices: [],

    // Filters and Pagination
    orderFilters: {
      orderId: '',
      customerName: '',
      productName: '',
      status: '',
      startDate: '',
      endDate: '',
    },
    invoiceFilters: {
      invoiceId: '',
      customerName: '',
      status: '',
      startDate: '',
      endDate: '',
    },
    currentPageOrders: 1,
    currentPageInvoices: 1,
    itemsPerPage: 10,
  }),

  getters: {
    filteredOrders(state) {
      return state.orders.filter((order) => {
        const matchesOrderId =
          !state.orderFilters.orderId ||
          order.orderId.toLowerCase().includes(state.orderFilters.orderId.toLowerCase())

        const matchesCustomer =
          !state.orderFilters.customerName ||
          order.customerName.toLowerCase().includes(state.orderFilters.customerName.toLowerCase())

        const matchesProduct =
          !state.orderFilters.productName ||
          order.productName.toLowerCase().includes(state.orderFilters.productName.toLowerCase())

        const matchesStatus =
          !state.orderFilters.status ||
          order.status.toLowerCase() === state.orderFilters.status.toLowerCase()

        return matchesOrderId && matchesCustomer && matchesProduct && matchesStatus
      })
    },

    paginatedOrders(state) {
      const startIndex = (state.currentPageOrders - 1) * state.itemsPerPage
      return this.filteredOrders.slice(startIndex, startIndex + state.itemsPerPage)
    },

    totalOrderPages(state) {
      return Math.ceil(this.filteredOrders.length / state.itemsPerPage)
    },

    filteredInvoices(state) {
      return state.invoices.filter((invoice) => {
        const matchesInvoiceId =
          !state.invoiceFilters.invoiceId ||
          invoice.invoiceId.toLowerCase().includes(state.invoiceFilters.invoiceId.toLowerCase())

        const matchesCustomer =
          !state.invoiceFilters.customerName ||
          invoice.customerName
            .toLowerCase()
            .includes(state.invoiceFilters.customerName.toLowerCase())

        const matchesStatus =
          !state.invoiceFilters.status ||
          invoice.status.toLowerCase() === state.invoiceFilters.status.toLowerCase()

        return matchesInvoiceId && matchesCustomer && matchesStatus
      })
    },

    paginatedInvoices(state) {
      const startIndex = (state.currentPageInvoices - 1) * state.itemsPerPage
      return this.filteredInvoices.slice(startIndex, startIndex + state.itemsPerPage)
    },

    totalInvoicePages(state) {
      return Math.ceil(this.filteredInvoices.length / state.itemsPerPage)
    },

    getInvoiceById: (state) => (id) => {
      return state.invoices.find((invoice) => invoice.id === id)
    },
  },

  actions: {
    // Modal Handlers
    openModal(modalName) {
      const modalStateName = `is${modalName}ModalOpen`
      this[modalStateName] = true
    },

    closeModal(modalName) {
      const modalStateName = `is${modalName}ModalOpen`
      this[modalStateName] = false
    },

    // Order Management
    async fetchOrders() {
      try {
        this.isLoading = true
        this.error = null
        const orders = await OrderService.getOrders()
        this.orders = orders
      } catch (error) {
        this.error = error.message
        console.error('Error fetching orders:', error)
      } finally {
        this.isLoading = false
      }
    },

    async handleAddSalesSubmit(salesData) {
      try {
        this.isLoading = true
        this.error = null
        const newOrder = await OrderService.addOrder(salesData)
        this.orders.unshift(newOrder)
        this.closeModal('AddSales')
      } catch (error) {
        this.error = error.message
        console.error('Error adding order:', error)
      } finally {
        this.isLoading = false
      }
    },

    async handleEditOrderSubmit(updatedOrder) {
      try {
        this.isLoading = true
        this.error = null
        const order = await OrderService.updateOrder(updatedOrder.id, updatedOrder)
        const index = this.orders.findIndex((o) => o.id === order.id)
        if (index !== -1) {
          this.orders[index] = order
        }
        this.closeModal('EditOrder')
      } catch (error) {
        this.error = error.message
        console.error('Error updating order:', error)
      } finally {
        this.isLoading = false
      }
    },

    async deleteOrder(orderId, orderData) {
      try {
        this.isLoading = true
        this.error = null

        await OrderService.deleteOrder(orderId, orderData)

        // Update local state
        this.orders = this.orders.filter((order) => order.orderId !== orderId)

        // Close any open modals
        this.closeModal('ViewOrder')
        this.closeModal('EditOrder')

        return true
      } catch (error) {
        this.error = error.message || 'Failed to delete order'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Invoice Management
    async fetchInvoices() {
      try {
        this.isLoading = true
        this.error = null
        const invoices = await OrderService.getInvoices()
        this.invoices = invoices
      } catch (error) {
        this.error = error.message
        console.error('Error fetching invoices:', error)
      } finally {
        this.isLoading = false
      }
    },

    async handleAddInvoiceSubmit(newInvoice) {
      try {
        this.isLoading = true
        this.error = null
        const invoice = await OrderService.addInvoice(newInvoice)
        this.invoices.push(invoice)
        this.closeModal('AddInvoice')
      } catch (error) {
        this.error = error.message
        console.error('Error adding invoice:', error)
      } finally {
        this.isLoading = false
      }
    },

    async handleEditInvoiceSubmit(updatedInvoice) {
      try {
        this.isLoading = true
        this.error = null
        const invoice = await OrderService.updateInvoice(updatedInvoice.id, updatedInvoice)
        const index = this.invoices.findIndex((i) => i.id === invoice.id)
        if (index !== -1) {
          this.invoices[index] = invoice
        }
        this.closeModal('EditInvoice')
      } catch (error) {
        this.error = error.message
        console.error('Error updating invoice:', error)
      } finally {
        this.isLoading = false
      }
    },

    async deleteInvoice(invoiceId, invoiceData) {
      try {
        this.isLoading = true
        this.error = null

        // Always fetch fresh data from database first
        await this.fetchInvoices()
        const invoice = this.invoices.find((inv) => inv.id === invoiceId)

        if (!invoice) {
          throw new Error('Invoice not found')
        }

        await OrderService.deleteInvoice(invoiceId, {
          salesRepresentative: invoice.salesRepresentative,
          ...invoiceData,
        })

        // Update local state
        this.invoices = this.invoices.filter((inv) => inv.id !== invoiceId)
        this.closeModal('EditInvoice')

        return true
      } catch (error) {
        console.error('Delete invoice error:', error)
        this.error = error.message || 'Failed to delete invoice'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async markInvoiceAsPaid(invoiceId) {
      try {
        this.isLoading = true
        this.error = null

        // Get current invoice for sales representative info
        const invoice = this.invoices.find((inv) => inv.id === invoiceId)
        const salesRepresentative = invoice?.salesRepresentative || 'system'

        // Let OrderService handle the validation and update
        const updatedInvoice = await OrderService.markInvoiceAsPaid(invoiceId, {
          salesRepresentative,
        })

        // Update local state after successful update
        await this.fetchInvoices()

        return true
      } catch (error) {
        console.error('Mark as paid error:', error)
        this.error = error.message || 'Failed to mark invoice as paid'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async refreshInvoices() {
      try {
        this.isLoading = true
        this.error = null
        const invoices = await OrderService.getInvoices()
        this.invoices = invoices
      } catch (error) {
        this.error = error.message || 'Failed to refresh invoices'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Pagination Handlers
    goToPage(pageType, page) {
      if (pageType === 'orders') {
        this.currentPageOrders = page
      } else {
        this.currentPageInvoices = page
      }
    },

    goToPreviousPage(pageType) {
      if (pageType === 'orders' && this.currentPageOrders > 1) {
        this.currentPageOrders--
      } else if (pageType === 'invoices' && this.currentPageInvoices > 1) {
        this.currentPageInvoices--
      }
    },

    goToNextPage(pageType) {
      if (pageType === 'orders' && this.currentPageOrders < this.totalOrderPages) {
        this.currentPageOrders++
      } else if (pageType === 'invoices' && this.currentPageInvoices < this.totalInvoicePages) {
        this.currentPageInvoices++
      }
    },

    // Filter Handlers
    resetFilters(filterType) {
      if (filterType === 'orders') {
        this.orderFilters = {
          orderId: '',
          customerName: '',
          productName: '',
          status: '',
          startDate: '',
          endDate: '',
        }
      } else {
        this.invoiceFilters = {
          invoiceId: '',
          customerName: '',
          status: '',
          startDate: '',
          endDate: '',
        }
      }
    },
  },
})
