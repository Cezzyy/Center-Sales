import { defineStore } from 'pinia';

export const useClientStore = defineStore('clientStore', {
  // State
  state: () => ({
    isModalOpen: false,
    showEditClientModal: false,
    selectedClient: null,
    searchQuery: '',
    clients: [
      {
        id: 1,
        firstName: 'Neil',
        lastName: 'Vallecer',
        address: '123 Business Ave, Suite 100',
        company: 'Tech Corp',
        email: 'neil.vallecer@gmail.com',
        phone: '+1 (555) 123-4567',
        profilePicture: '/src/assets/tifa lockhart.jpg',
      },
      // Add more client data here
    ],
    currentPage: 1,
    clientsPerPage: 5,
  }),

  // Getters
  getters: {
    filteredClients(state) {
      const query = state.searchQuery.toLowerCase();
      return query
        ? state.clients.filter(client => 
            client.firstName.toLowerCase().includes(query) ||
            client.lastName.toLowerCase().includes(query) ||
            client.company.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query)
          )
        : state.clients;
    },
    totalPages(state) {
      return Math.ceil(this.filteredClients.length / state.clientsPerPage);
    },
    paginatedClients(state) {
      const start = (state.currentPage - 1) * state.clientsPerPage;
      const end = start + state.clientsPerPage;
      return this.filteredClients.slice(start, end);
    },
    pageNumbers() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
  },

  // Actions
  actions: {
    // Search
    setSearchQuery(query) {
      this.searchQuery = query;
      this.currentPage = 1; // Reset to first page when searching
    },

    // Modal handlers
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    
    // Client operations
    addClient(client) {
      const newClient = {
        ...client,
        id: this.clients.length + 1, // Simple ID generation
      };
      this.clients.push(newClient);
      this.closeModal();
    },
    
    editClient(client) {
      this.selectedClient = client;
      this.showEditClientModal = true;
    },
    
    closeEditModal() {
      this.selectedClient = null;
      this.showEditClientModal = false;
    },
    
    updateClient(updatedClient) {
      const index = this.clients.findIndex(c => c.id === updatedClient.id);
      if (index !== -1) {
        this.clients[index] = { ...updatedClient };
      }
      this.closeEditModal();
    },
    
    async deleteClient(clientId) {
      const index = this.clients.findIndex(c => c.id === clientId);
      if (index !== -1) {
        this.clients.splice(index, 1);
        // Reset to previous page if current page is empty
        if (this.paginatedClients.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }
      }
    },

    // Pagination handlers
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
});
