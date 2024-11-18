import { defineStore } from 'pinia';

export const useClientStore = defineStore('clientStore', {
  // State
  state: () => ({
    isModalOpen: false,
    showEditClientModal: false,
    selectedClient: null,
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
    totalPages() {
      return Math.ceil(this.clients.length / this.clientsPerPage);
    },
    paginatedClients() {
      const start = (this.currentPage - 1) * this.clientsPerPage;
      const end = start + this.clientsPerPage;
      return this.clients.slice(start, end);
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
  },

  // Actions
  actions: {
    // Modal handlers
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    editClient(client) {
      this.selectedClient = client;
      this.showEditClientModal = true;
    },
    closeEditModal() {
      this.showEditClientModal = false;
    },

    // Save client changes
    saveClientChanges(updatedClient) {
      const index = this.clients.findIndex(client => client.id === updatedClient.id);
      if (index !== -1) {
        this.clients[index] = { ...updatedClient };
      }
      this.closeEditModal();
    },

    // Pagination handlers
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
});
