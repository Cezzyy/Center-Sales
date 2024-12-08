<script setup>
import { useAuthStore } from '@/stores/authStore'
import { ref, computed, watch } from 'vue'
import { useActivityLog } from '@/composables/useActivityLog'

// Initialize stores and composables
const authStore = useAuthStore()
const { logUserAction } = useActivityLog()

// State Management
const users = ref(authStore.getAllUsers || [])
const error = ref(null)
const searchQuery = ref('')
const selectedRole = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Form Management
const userForm = ref({
  username: '',
  email: '',
  role: 'user',
  position: ''
})

const formErrors = ref({})

// Computed Properties
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || user.role === selectedRole.value
    return matchesSearch && matchesRole
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

const totalUsers = computed(() => {
  return users.value.length
})

// Form Validation
const validateForm = () => {
  const errors = {}
  let isValid = true

  if (!userForm.value.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  } else if (userForm.value.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!userForm.value.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(userForm.value.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }

  if (!userForm.value.role) {
    errors.role = 'Role is required'
    isValid = false
  }

  formErrors.value = errors
  return isValid
}

// User Management Functions
const addUser = async () => {
  if (!validateForm()) return

  try {
    // Add user to store
    const newUser = {
      id: Date.now(),  // temporary ID generation
      ...userForm.value,
      createdAt: new Date()
    }
    
    authStore.users.push(newUser)
    users.value = [...authStore.getAllUsers]
    
    // Log the action
    await logUserAction('add_user', { userId: newUser.id, username: newUser.username })
    
    closeModal()
    resetForm()
  } catch (err) {
    error.value = err.message
  }
}

const editUser = async (userId) => {
  if (!validateForm()) return

  try {
    const userIndex = authStore.users.findIndex(u => u.id === userId)
    if (userIndex === -1) throw new Error('User not found')

    // Update user in store
    authStore.users[userIndex] = {
      ...authStore.users[userIndex],
      ...userForm.value
    }
    users.value = [...authStore.getAllUsers]

    // Log the action
    await logUserAction('edit_user', { userId, username: userForm.value.username })

    closeModal()
    resetForm()
  } catch (err) {
    error.value = err.message
  }
}

const confirmDelete = async () => {
  if (!userToDelete.value) return
  
  try {
    const userIndex = authStore.users.findIndex(u => u.id === userToDelete.value.id)
    if (userIndex === -1) throw new Error('User not found')

    const username = authStore.users[userIndex].username
    
    // Remove user from store
    authStore.users.splice(userIndex, 1)
    users.value = [...authStore.getAllUsers]

    // Log the action
    await logUserAction('delete_user', { userId: userToDelete.value.id, username })
    
    // Close modal and reset
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (err) {
    error.value = err.message
  }
}

const initiateDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const cancelDelete = () => {
  userToDelete.value = null
  showDeleteModal.value = false
}

// UI Helper Functions
const resetForm = () => {
  userForm.value = {
    username: '',
    email: '',
    role: 'user',
    position: ''
  }
  formErrors.value = {}
}

const openModal = (user = null) => {
  if (user) {
    userForm.value = { ...user }
  } else {
    resetForm()
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Search and Filter Handlers
const handleSearch = (event) => {
  searchQuery.value = event.target.value
  currentPage.value = 1
}

const handleFilterChange = (event) => {
  selectedRole.value = event.target.value
  currentPage.value = 1
}

// Error Handling
const clearError = () => {
  error.value = null
}

// Watchers
watch([searchQuery, selectedRole], () => {
  currentPage.value = 1
})
</script>

<template>
  <section class="user-management">
    <!-- Title Section -->
    <header class="user-management__header">
      <h1 class="user-management__title">Manage Users</h1>
    </header>

    <!-- Error Display -->
    <div v-if="error" class="user-management__error" @click="clearError">
      {{ error }}
    </div>

    <!-- Controls Section -->
    <div class="user-management__controls">
      <div class="user-management__search-filter">
        <input
          type="text"
          placeholder="Search users..."
          class="user-management__search"
          v-model="searchQuery"
          @input="handleSearch"
        />
        <select class="user-management__filter" v-model="selectedRole" @change="handleFilterChange">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>
      <button class="user-management__add-btn" @click="openModal()">Add New User</button>
    </div>

    <!-- User Count -->
    <div class="user-management__count">
      Total Users: <span>{{ totalUsers }}</span>
    </div>

    <!-- User Table -->
    <div class="user-management__table-wrapper">
      <table class="user-management__table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role(s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="user-management__role">{{ user.role }}</span>
            </td>
            <td class="user-management__actions">
              <button
                class="user-management__action-btn user-management__action-btn--edit"
                @click="openModal(user)"
              >
                Edit
              </button>
              <button
                class="user-management__action-btn user-management__action-btn--delete"
                @click="initiateDelete(user)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="user-management__pagination">
      <button
        class="user-management__page-btn"
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        &laquo;
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="user-management__page-btn"
        :class="{ 'user-management__page-btn--active': page === currentPage }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
      <button
        class="user-management__page-btn"
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        &raquo;
      </button>
    </nav>

    <!-- Add/Edit User Modal -->
    <div v-if="showModal" class="user-management__modal">
      <div class="user-management__modal-content">
        <h2 class="user-management__modal-title">
          {{ userForm.id ? 'Edit User' : 'Add New User' }}
        </h2>
        <form
          class="user-management__form"
          @submit.prevent="userForm.id ? editUser(userForm.id) : addUser()"
        >
          <div class="user-management__form-group">
            <label>Username:</label>
            <input
              type="text"
              v-model="userForm.username"
              :class="{ error: formErrors.username }"
            />
            <span v-if="formErrors.username" class="error-message">
              {{ formErrors.username }}
            </span>
          </div>
          <div class="user-management__form-group">
            <label>Email:</label>
            <input type="email" v-model="userForm.email" :class="{ error: formErrors.email }" />
            <span v-if="formErrors.email" class="error-message">
              {{ formErrors.email }}
            </span>
          </div>
          <div class="user-management__form-group">
            <label>Role:</label>
            <select v-model="userForm.role" :class="{ error: formErrors.role }">
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <span v-if="formErrors.role" class="error-message">
              {{ formErrors.role }}
            </span>
          </div>
          <div class="user-management__form-group">
            <label>Position:</label>
            <input type="text" v-model="userForm.position" />
          </div>
          <div class="user-management__form-actions">
            <button type="submit" class="user-management__submit-btn">
              {{ userForm.id ? 'Update' : 'Save' }}
            </button>
            <button type="button" class="user-management__cancel-btn" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="user-management__modal">
      <div class="user-management__modal-content delete-confirmation">
        <h2 class="user-management__modal-title">Confirm Delete</h2>
        <p class="delete-confirmation__message">
          Are you sure you want to delete user "{{ userToDelete?.username }}"? This action cannot be undone.
        </p>
        <div class="user-management__form-actions">
          <button 
            @click="confirmDelete" 
            class="user-management__delete-btn"
          >
            Delete
          </button>
          <button 
            @click="cancelDelete" 
            class="user-management__cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.user-management {
  padding: 2rem;
  max-width: 100%;
  margin: 0 auto;
}

/* Header Styles */
.user-management__header {
  margin-bottom: 2rem;
}

.user-management__title {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}

/* Controls Section */
.user-management__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.user-management__search-filter {
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 600px;
}

.user-management__search,
.user-management__filter {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.user-management__search {
  flex: 1;
}

.user-management__filter {
  width: 150px;
}

.user-management__add-btn {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.user-management__add-btn:hover {
  background-color: #45a049;
}

/* User Count */
.user-management__count {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #666;
}

/* Table Styles */
.user-management__table-wrapper {
  overflow-x: auto;
}

.user-management__table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.user-management__table th,
.user-management__table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-management__table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.user-management__table tr:hover {
  background-color: #f5f5f5;
}

/* Role Badge */
.user-management__role {
  background-color: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
}

/* Action Buttons */
.user-management__actions {
  display: flex;
  gap: 0.5rem;
}

.user-management__action-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.user-management__action-btn--edit {
  background-color: #007bff;
  color: white;
}

.user-management__action-btn--delete {
  background-color: #dc3545;
  color: white;
}

.user-management__action-btn:hover {
  opacity: 0.9;
}

/* Pagination */
.user-management__pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.user-management__page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
}

.user-management__page-btn--active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.user-management__page-btn:hover:not(.user-management__page-btn--active) {
  background-color: #f0f0f0;
}

/* Modal Styles */
.user-management__modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-management__modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.user-management__modal-title {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

/* Form Styles */
.user-management__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-management__form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-management__form-group label {
  font-weight: 500;
}

.user-management__form-group input,
.user-management__form-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.user-management__form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.user-management__submit-btn,
.user-management__cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.user-management__submit-btn {
  background-color: #4caf50;
  color: white;
}

.user-management__cancel-btn {
  background-color: #6c757d;
  color: white;
}

.user-management__submit-btn:hover,
.user-management__cancel-btn:hover {
  opacity: 0.9;
}

.delete-confirmation {
  max-width: 400px !important;
}

.delete-confirmation__message {
  margin: 1rem 0;
  color: #666;
  text-align: center;
}

.user-management__delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.user-management__delete-btn:hover {
  background-color: #c82333;
}

.user-management__cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-left: 0.5rem;
  transition: background-color 0.2s;
}

.user-management__cancel-btn:hover {
  background-color: #5a6268;
}

/* Responsive Design */
@media (max-width: 768px) {
  .user-management__controls {
    flex-direction: column;
    gap: 1rem;
  }

  .user-management__search-filter {
    flex-direction: column;
    max-width: 100%;
  }

  .user-management__filter {
    width: 100%;
  }

  .user-management__add-btn {
    width: 100%;
  }

  .user-management__table {
    font-size: 0.875rem;
  }

  .user-management__actions {
    flex-direction: column;
  }

  .user-management__action-btn {
    width: 100%;
  }
}
</style>
