<script setup>
import { ref, computed, watch } from 'vue'
import { useActivityLog } from '@/composables/useActivityLog'
import { usePermissionsStore } from '@/stores/permissionsStore'
import { useAuthStore } from '@/stores/authStore'

// Initialize stores and activity logger
const permissionsStore = usePermissionsStore()
const authStore = useAuthStore()
const { logAction } = useActivityLog()

// Get available permissions from store
const availablePermissions = computed(() => permissionsStore.getAllPermissions)

// State Management
const roles = computed(() => {
  return Object.entries(permissionsStore.rolePermissions).map(([name, permissions]) => ({
    id: name,
    name,
    description: getRoleDescription(name),
    permissions,
    createdAt: new Date(), // In a real app, this would come from backend
  }))
})

const error = ref(null)
const searchQuery = ref('')
const showModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Form Management
const roleForm = ref({
  id: '',
  name: '',
  description: '',
  permissions: [],
})

const formErrors = ref({})

// Computed Properties
const filteredRoles = computed(() => {
  return roles.value.filter((role) => {
    return role.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRoles.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRoles.value.length / itemsPerPage.value)
})

const totalRoles = computed(() => {
  return roles.value.length
})

// Form Validation
const validateForm = () => {
  const errors = {}
  let isValid = true

  if (!roleForm.value.name.trim()) {
    errors.name = 'Role name is required'
    isValid = false
  } else if (roleForm.value.name.length < 2) {
    errors.name = 'Role name must be at least 2 characters'
    isValid = false
  } else if (roleForm.value.name === 'admin' && !roleForm.value.id) {
    errors.name = 'Cannot create another admin role'
    isValid = false
  }

  if (!roleForm.value.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  }

  if (!roleForm.value.permissions.length) {
    errors.permissions = 'At least one permission must be selected'
    isValid = false
  }

  formErrors.value = errors
  return isValid
}

// Helper function for role descriptions
const getRoleDescription = (role) => {
  switch (role) {
    case 'admin':
      return 'Full system access'
    case 'manager':
      return 'Department management access'
    case 'user':
      return 'Basic user access'
    default:
      return 'Custom role'
  }
}

// Role Management Functions
const addRole = async () => {
  if (!validateForm()) return
  if (!permissionsStore.hasPermission('manage_roles')) {
    error.value = 'You do not have permission to add roles'
    return
  }

  try {
    const { name, permissions } = roleForm.value
    
    // Add role to permissions store
    permissionsStore.addRole(name, permissions)
    
    // Log the action
    await logAction({
      action: 'CREATE_ROLE',
      category: 'role',
      details: `Created new role: ${name} with permissions: ${permissions.join(', ')}`,
      targetId: name
    })
    
    showModal.value = false
    resetForm()
  } catch (e) {
    error.value = 'Failed to add role'
    console.error('Error adding role:', e)
  }
}

const editRole = async (roleId) => {
  if (!permissionsStore.hasPermission('manage_roles')) {
    error.value = 'You do not have permission to edit roles'
    return
  }

  try {
    if (!validateForm()) return

    const { name, permissions } = roleForm.value
    const oldPermissions = permissionsStore.getRolePermissions(roleId)
    
    // Update role permissions
    permissionsStore.updateRolePermissions(name, permissions)
    
    // Log the action
    await logAction({
      action: 'UPDATE_ROLE',
      category: 'role',
      details: `Updated role ${name}: Permissions changed from [${oldPermissions.join(', ')}] to [${permissions.join(', ')}]`,
      targetId: roleId
    })

    showModal.value = false
    resetForm()
  } catch (e) {
    error.value = 'Failed to edit role'
    console.error('Error editing role:', e)
  }
}

const deleteRole = async (roleId) => {
  if (!permissionsStore.hasPermission('manage_roles')) {
    error.value = 'You do not have permission to delete roles'
    return
  }

  try {
    if (roleId === 'admin') {
      error.value = 'Cannot delete admin role'
      return
    }

    if (!confirm('Are you sure you want to delete this role?')) return

    // Delete role from permissions store
    permissionsStore.removeRole(roleId)
    
    // Log the action
    await logAction({
      action: 'DELETE_ROLE',
      category: 'role',
      details: `Deleted role: ${roleId}`,
      targetId: roleId
    })
  } catch (e) {
    error.value = 'Failed to delete role'
    console.error('Error deleting role:', e)
  }
}

// UI Helper Functions
const resetForm = () => {
  roleForm.value = {
    id: '',
    name: '',
    description: '',
    permissions: [],
  }
  formErrors.value = {}
}

const openModal = (role = null) => {
  if (role) {
    roleForm.value = { ...role }
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

const handleSearch = (event) => {
  searchQuery.value = event.target.value
  currentPage.value = 1
}

// Error Handling
const clearError = () => {
  error.value = null
}

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <section class="role-management">
    <!-- Header Section -->
    <header class="role-management__header">
      <h1 class="role-management__title">Role Management</h1>
      <p class="role-management__subtitle">
        Manage roles and permissions for better access control
      </p>
    </header>

    <!-- Error Alert -->
    <div v-if="error" class="role-management__error" @click="clearError">
      {{ error }}
      <span class="role-management__error-close">&times;</span>
    </div>

    <!-- Controls Section -->
    <div class="role-management__controls">
      <div class="role-management__search-filter">
        <input
          type="text"
          placeholder="Search roles..."
          class="role-management__search"
          v-model="searchQuery"
          @input="handleSearch"
        />
      </div>
      <button class="role-management__add-btn" @click="openModal()">Add New Role</button>
    </div>

    <!-- Role Count -->
    <p class="role-management__count">Total Roles: {{ totalRoles }}</p>

    <!-- Roles Table -->
    <div class="role-management__table-container">
      <table class="role-management__table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in paginatedRoles" :key="role.id">
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>
              <div class="role-management__permissions">
                <span
                  v-for="permission in role.permissions"
                  :key="permission"
                  class="role-management__permission-tag"
                >
                  {{ permission }}
                </span>
              </div>
            </td>
            <td>{{ new Date(role.createdAt).toLocaleDateString() }}</td>
            <td class="role-management__actions">
              <button
                class="role-management__action-btn role-management__action-btn--edit"
                @click="openModal(role)"
              >
                Edit
              </button>
              <button
                class="role-management__action-btn role-management__action-btn--delete"
                @click="deleteRole(role.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="role-management__pagination">
      <button
        class="role-management__page-btn"
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        &laquo;
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="role-management__page-btn"
        :class="{ active: currentPage === page }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
      <button
        class="role-management__page-btn"
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        &raquo;
      </button>
    </nav>

    <!-- Modal -->
    <div v-if="showModal" class="role-management__modal">
      <div class="role-management__modal-content">
        <h2 class="role-management__modal-title">
          {{ roleForm.id ? 'Edit Role' : 'Add New Role' }}
        </h2>
        <form
          class="role-management__form"
          @submit.prevent="roleForm.id ? editRole(roleForm.id) : addRole()"
        >
          <div class="role-management__form-group">
            <label>Role Name:</label>
            <input
              type="text"
              v-model="roleForm.name"
              :class="{ error: formErrors.name }"
            />
            <span v-if="formErrors.name" class="error-message">
              {{ formErrors.name }}
            </span>
          </div>

          <div class="role-management__form-group">
            <label>Description:</label>
            <textarea
              v-model="roleForm.description"
              :class="{ error: formErrors.description }"
            ></textarea>
            <span v-if="formErrors.description" class="error-message">
              {{ formErrors.description }}
            </span>
          </div>

          <div class="role-management__form-group">
            <label>Permissions:</label>
            <div class="role-management__permissions-grid">
              <div
                v-for="permission in availablePermissions"
                :key="permission.id"
                class="role-management__permission-item"
              >
                <input
                  type="checkbox"
                  :id="permission.id"
                  v-model="roleForm.permissions"
                  :value="permission.id"
                />
                <label :for="permission.id">
                  <strong>{{ permission.name }}</strong>
                  <span>{{ permission.description }}</span>
                </label>
              </div>
            </div>
            <span v-if="formErrors.permissions" class="error-message">
              {{ formErrors.permissions }}
            </span>
          </div>

          <div class="role-management__form-actions">
            <button type="submit" class="role-management__submit-btn">
              {{ roleForm.id ? 'Update' : 'Save' }}
            </button>
            <button type="button" class="role-management__cancel-btn" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.role-management {
  padding: 2rem;
  max-width: 100%;
}

.role-management__header {
  margin-bottom: 2rem;
}

.role-management__title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.role-management__subtitle {
  color: #666;
  font-size: 1rem;
}

.role-management__error {
  background-color: #ff6b6b;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.role-management__error-close {
  font-size: 1.5rem;
}

.role-management__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.role-management__search-filter {
  flex: 1;
  display: flex;
  gap: 1rem;
}

.role-management__search {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.role-management__add-btn {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.role-management__add-btn:hover {
  background-color: #45a049;
}

.role-management__count {
  color: #666;
  margin-bottom: 1rem;
}

.role-management__table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.role-management__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.role-management__table th,
.role-management__table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.role-management__table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.role-management__permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-management__permission-tag {
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #495057;
}

.role-management__actions {
  display: flex;
  gap: 0.5rem;
}

.role-management__action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.role-management__action-btn--edit {
  background-color: #ffd43b;
  color: #000;
}

.role-management__action-btn--edit:hover {
  background-color: #fcc419;
}

.role-management__action-btn--delete {
  background-color: #ff6b6b;
  color: white;
}

.role-management__action-btn--delete:hover {
  background-color: #fa5252;
}

.role-management__pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.role-management__page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.role-management__page-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.role-management__page-btn.active {
  background-color: #339af0;
  color: white;
  border-color: #339af0;
}

.role-management__page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.role-management__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.role-management__modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.role-management__modal-title {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.role-management__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.role-management__form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.role-management__form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.role-management__form-group input,
.role-management__form-group textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.role-management__form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.role-management__permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.role-management__permission-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.role-management__permission-item label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.role-management__permission-item label span {
  font-size: 0.875rem;
  color: #666;
  font-weight: normal;
}

.role-management__form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.role-management__submit-btn,
.role-management__cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.role-management__submit-btn {
  background-color: #4caf50;
  color: white;
}

.role-management__submit-btn:hover {
  background-color: #45a049;
}

.role-management__cancel-btn {
  background-color: #e9ecef;
  color: #495057;
}

.role-management__cancel-btn:hover {
  background-color: #dee2e6;
}

.error {
  border-color: #ff6b6b !important;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .role-management {
    padding: 1rem;
  }

  .role-management__controls {
    flex-direction: column;
  }

  .role-management__search-filter {
    width: 100%;
  }

  .role-management__add-btn {
    width: 100%;
  }
}
</style>