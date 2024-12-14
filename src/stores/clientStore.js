import { defineStore } from 'pinia'
import { clientsAPI } from '@/services/dataService'

export const useClientStore = defineStore('clientStore', {
  // State
  state: () => ({
    isModalOpen: false,
    showEditClientModal: false,
    selectedClient: null,
    searchQuery: '',
    clients: [],
    currentPage: 1,
    clientsPerPage: 5,
    isLoading: false,
    error: null,
  }),

  // Getters
  getters: {
    filteredClients(state) {
      const query = state.searchQuery.toLowerCase()
      return query
        ? state.clients.filter(
            (client) =>
              client.firstName.toLowerCase().includes(query) ||
              client.lastName.toLowerCase().includes(query) ||
              client.company.toLowerCase().includes(query) ||
              client.email.toLowerCase().includes(query),
          )
        : state.clients
    },
    totalPages(state) {
      return Math.ceil(this.filteredClients.length / state.clientsPerPage)
    },
    paginatedClients(state) {
      const start = (state.currentPage - 1) * state.clientsPerPage
      const end = start + state.clientsPerPage
      return this.filteredClients.slice(start, end)
    },
    pageNumbers() {
      const pages = []
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i)
      }
      return pages
    },
  },

  // Actions
  actions: {
    // Fetch all clients from backend
    async fetchClients() {
      try {
        this.isLoading = true
        this.error = null
        const data = await clientsAPI.getAllClients()
        this.clients = data
      } catch (error) {
        console.error('Error fetching clients:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Search
    setSearchQuery(query) {
      this.searchQuery = query
      this.currentPage = 1 // Reset to first page when searching
    },

    // Modal handlers
    openModal() {
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
    },

    // Client operations
    async addClient(client) {
      try {
        this.isLoading = true
        this.error = null
        const newClient = await clientsAPI.createClient(client)
        this.clients.push(newClient)
        this.closeModal()
        return newClient
      } catch (error) {
        console.error('Error adding client:', error)
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    editClient(client) {
      this.selectedClient = client
      this.showEditClientModal = true
    },

    closeEditModal() {
      this.selectedClient = null
      this.showEditClientModal = false
    },

    async updateClient(updatedClient) {
      try {
        this.isLoading = true
        this.error = null
        const updated = await clientsAPI.updateClient(updatedClient.id, updatedClient)
        const index = this.clients.findIndex((c) => c.id === updated.id)
        if (index !== -1) {
          this.clients[index] = updated
        }
        this.closeEditModal()
        return updated
      } catch (error) {
        console.error('Error updating client:', error)
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteClient(clientId) {
      try {
        this.isLoading = true
        this.error = null
        await clientsAPI.deleteClient(clientId)
        this.clients = this.clients.filter((c) => c.id !== clientId)
      } catch (error) {
        console.error('Error deleting client:', error)
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Pagination handlers
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
  },
})
