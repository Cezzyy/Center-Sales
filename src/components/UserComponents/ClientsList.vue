<script setup>
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { useClientStore } from '@/stores/clientStore'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useActivityLog } from '@/composables/useActivityLog'
import { usePermissions } from '@/composables/usePermissions'

// Initialize activity logger and permissions
const store = useClientStore()
const authStore = useAuthStore()
const { logAction } = useActivityLog()
const { can } = usePermissions()

// Fetch clients when component mounts
onMounted(async () => {
  try {
    await store.fetchClients()
  } catch (error) {
    console.error('Failed to fetch clients:', error)
  }
})

// Lazy load modals for better initial load performance
const AddClientModal = defineAsyncComponent(() => import('../UserSideModals/AddClientModal.vue'))
const EditClientModal = defineAsyncComponent(() => import('../UserSideModals/EditClientModal.vue'))
const DeleteConfirmationModal = defineAsyncComponent(
  () => import('../UserSideModals/DeleteConfirmationModal.vue'),
)

// Destructure only what we need from the store
const {
  searchQuery,
  filteredClients,
  currentPage,
  isModalOpen,
  showEditClientModal,
  selectedClient,
  isLoading,
  error,
} = storeToRefs(store)

// Add state for delete confirmation
const showDeleteModal = ref(false)
const clientToDelete = ref(null)

// Computed properties from store getters
const hasClients = computed(() => filteredClients.value.length > 0)
const displayedClients = computed(() => store.paginatedClients)
const totalPages = computed(() => store.totalPages)
const availablePages = computed(() => store.pageNumbers)

// Action handlers
const handleSearch = (event) => {
  store.setSearchQuery(event.target.value)
}

const handleAddClient = async (clientData) => {
  if (!can.write()) {
    console.error('Permission denied: Cannot add clients')
    return
  }

  try {
    const newClient = await store.addClient(clientData)
    logAction('Added new client', {
      clientId: newClient.id,
      clientName: `${newClient.firstName} ${newClient.lastName}`,
      userId: authStore.currentUser?.id,
    })
    store.closeModal()
  } catch (error) {
    console.error('Error adding client:', error)
  }
}

const handleEditClient = async (clientData) => {
  if (!can.write()) {
    console.error('Permission denied: Cannot edit clients')
    return
  }

  try {
    const updatedClient = await store.updateClient(clientData)
    logAction('Updated client', {
      clientId: updatedClient.id,
      clientName: `${updatedClient.firstName} ${updatedClient.lastName}`,
      userId: authStore.currentUser?.id,
    })
    store.closeEditModal()
  } catch (error) {
    console.error('Error updating client:', error)
  }
}

const handleDeleteClient = (client) => {
  if (!can.write()) {
    console.error('Permission denied: Cannot delete clients')
    return
  }
  clientToDelete.value = client
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!clientToDelete.value) return

  try {
    await store.deleteClient(clientToDelete.value.id)
    logAction('Deleted client', {
      clientId: clientToDelete.value.id,
      clientName: `${clientToDelete.value.firstName} ${clientToDelete.value.lastName}`,
      userId: authStore.currentUser?.id,
    })
    showDeleteModal.value = false
    clientToDelete.value = null
  } catch (error) {
    console.error('Error deleting client:', error)
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  clientToDelete.value = null
}

// Navigation handlers
const handlePageChange = (page) => {
  store.changePage(page)
}

const goToNextPage = () => {
  store.changePage(currentPage.value + 1)
}

const goToPreviousPage = () => {
  store.changePage(currentPage.value - 1)
}
</script>

<template>
  <div class="clients-section">
    <!-- Header Section -->
    <div class="section-top">
      <div class="section-header">
        <h2 class="section-title">Clients List</h2>
        <div class="search-container">
          <input
            type="text"
            :value="searchQuery"
            @input="handleSearch"
            placeholder="Search clients..."
            class="search-input"
          />
        </div>
      </div>
      <button v-if="can.write()" class="add-button" @click="store.openModal">
        <span class="plus-icon">+</span>
        Add Client
      </button>
    </div>

    <!-- Add loading and error states -->
    <div v-if="isLoading" class="loading-spinner">Loading...</div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Modals -->
    <AddClientModal
      v-if="isModalOpen"
      :isModalOpen="isModalOpen"
      @close="store.closeModal"
      @submit="handleAddClient"
    />

    <EditClientModal
      v-if="showEditClientModal"
      :isOpen="showEditClientModal"
      :client="selectedClient"
      @close="store.closeEditModal"
      @submit="handleEditClient"
    />

    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :isOpen="showDeleteModal"
      :client="clientToDelete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Table Section -->
    <div class="table-container">
      <table class="clients-table" v-if="hasClients">
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
          <tr v-for="client in displayedClients" :key="client.id">
            <td>
              <div class="profile-pic">
                <img
                  :src="client.profilePicture"
                  :alt="`${client.firstName} ${client.lastName}`"
                  loading="lazy"
                />
              </div>
            </td>
            <td>{{ client.firstName }}</td>
            <td>{{ client.lastName }}</td>
            <td>{{ client.address }}</td>
            <td>{{ client.company }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone }}</td>
            <td class="actions">
              <button
                v-if="can.write()"
                class="edit-btn"
                @click="store.editClient(client)"
                :title="`Edit ${client.firstName} ${client.lastName}`"
              >
                Edit
              </button>
              <button
                v-if="can.delete()"
                class="delete-btn"
                @click="handleDeleteClient(client)"
                :title="`Delete ${client.firstName} ${client.lastName}`"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No Results Message -->
      <div v-else class="no-results">
        <div class="no-results-content">
          <i class="fas fa-search no-results-icon"></i>
          <h3>No Clients Found</h3>
          <p>No clients match your search criteria. Try adjusting your search terms.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="hasClients">
        <button
          class="page-btn"
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          title="Previous page"
        >
          Previous
        </button>
        <button
          v-for="page in availablePages"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="handlePageChange(page)"
          :title="'Go to page ' + page"
        >
          {{ page }}
        </button>
        <button
          class="page-btn"
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          title="Next page"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

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

.section-header {
  display: flex;
  align-items: center;
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

.search-container {
  margin-left: 2rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  width: 250px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: white;
  border-radius: 8px;
  margin: 2rem 0;
}

.no-results-content {
  text-align: center;
  color: #64748b;
}

.no-results-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #94a3b8;
}

.no-results-content h3 {
  font-size: 1.25rem;
  color: #334155;
  margin-bottom: 0.5rem;
}

.no-results-content p {
  font-size: 0.95rem;
  max-width: 300px;
  margin: 0 auto;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  color: #4f46e5;
}

.error-message {
  text-align: center;
  padding: 1rem;
  color: #ef4444;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  margin: 1rem 0;
}
</style>
