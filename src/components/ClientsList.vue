<template>
  <div class="clients-section">
    <div class="section-top">
      <h2 class="section-title">Clients List</h2>
      <button class="add-button" @click="openModal">
        <span class="plus-icon">+</span>
        Add Client
      </button>
    </div>

    <AddClientModal :isModalOpen="isModalOpen" @close="closeModal" />

    <!-- Edit Client Modal -->
    <EditClientModal
      v-if="showEditClientModal"
      :clientData="selectedClient"
      @close="closeEditModal"
      @save="saveClientChanges"
    />

    <div class="table-container">
      <table class="clients-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Company</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
      <tr v-for="client in paginatedClients" :key="client.id">
        <td>
      <div class="profile-pic">
        <img :src="client.profilePicture || '/default-avatar.png'" alt="Profile Picture" />
      </div>
      </td>
      <td>{{ client.firstName }}</td>
      <td>{{ client.lastName }}</td>
      <td>{{ client.address }}</td>
      <td>{{ client.company }}</td>
      <td>{{ client.email }}</td>
      <td>{{ client.phone }}</td>
      <td class="actions">
        <button class="edit-btn" @click="editClient(client)">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
      </tr>
    </tbody>
      </table>
      <div class="pagination">
  <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
    Previous
  </button>
  <button
    v-for="page in pageNumbers"
    :key="page"
    class="page-btn"
    :class="{ active: page === currentPage }"
    @click="changePage(page)"
  >
    {{ page }}
  </button>
  <button
    class="page-btn"
    @click="changePage(currentPage + 1)"
    :disabled="currentPage === totalPages"
  >
    Next
  </button>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AddClientModal from './AddClientModal.vue'
import EditClientModal from './EditClientModal.vue'

// State variables
const isModalOpen = ref(false)
const showEditClientModal = ref(false)
const selectedClient = ref(null)
const clients = ref([
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
])

// Open Add Client Modal
const openModal = () => {
  isModalOpen.value = true
}

// Close Add Client Modal
const closeModal = () => {
  isModalOpen.value = false
}

// Open Edit Client Modal
const editClient = (client) => {
  selectedClient.value = client
  showEditClientModal.value = true
}

// Close Edit Client Modal
const closeEditModal = () => {
  showEditClientModal.value = false
}

// Save changes made to the client
const saveClientChanges = (updatedClient) => {
  const index = clients.value.findIndex((c) => c.id === updatedClient.id)
  if (index !== -1) {
    clients.value[index] = { ...updatedClient }
  }
  closeEditModal()
}

// Pagination variables
const currentPage = ref(1)
const clientsPerPage = 5

// Computed properties
const totalPages = computed(() => Math.ceil(clients.value.length / clientsPerPage))
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * clientsPerPage
  const end = start + clientsPerPage
  return clients.value.slice(start, end)
})
const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
.clients-section {
  width: 100%;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(to right, #ffffff, #f8fafc);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.section-title {
  font-size: 1.75rem;
  color: #1e293b;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.add-button {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.add-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
  padding: 1rem;
}

.clients-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1000px;
}

.clients-table th,
.clients-table td {
  padding: 1.25rem 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  font-size: 0.95rem;
}

.clients-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.clients-table tbody tr:hover {
  background-color: rgba(249, 250, 251, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.profile-pic {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.1);
  border-color: #4f46e5;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
}

/* Custom scrollbar for webkit browsers */
.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn.active {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: white;
}

.page-btn:hover:not(.active) {
  background-color: #f5f5f5;
}

.page-ellipsis {
  padding: 0.5rem;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .clients-section {
    border-radius: 0;
  }

  .section-top {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .table-container {
    margin: 0;
  }
}
</style>
