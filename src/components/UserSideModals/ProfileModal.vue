<script setup>
import { useAuthStore } from '../../stores/authStore'
import { usePermissionsStore } from '../../stores/permissionsStore'
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  }
})

const authStore = useAuthStore()
const permissionsStore = usePermissionsStore()
const currentUser = computed(() => authStore.currentUser)
const userPermissions = computed(() => permissionsStore.getRolePermissions(currentUser.value?.role || ''))

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

// Helper function to format permission name
const formatPermissionName = (permission) => {
  return permission
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleClose">
    <div class="modal-container" @click.stop>
      <button class="close-button" @click="handleClose">×</button>

      <div class="modal-content">
        <!-- Left Side - Profile Picture and Role Badge -->
        <div class="profile-picture-section">
          <div class="avatar">{{ currentUser?.username?.charAt(0) || 'U' }}</div>
          <div class="role-badge" :class="currentUser?.role">
            {{ currentUser?.role?.toUpperCase() }}
          </div>
        </div>

        <!-- Right Side - Profile Information -->
        <div class="profile-info-section">
          <div class="info-group">
            <label>Name</label>
            <p>{{ currentUser?.username || 'Not Available' }}</p>
          </div>

          <div class="info-group">
            <label>Position</label>
            <p>{{ currentUser?.position || 'Not Available' }}</p>
          </div>

          <div class="info-group">
            <label>Email Address</label>
            <p>{{ currentUser?.email || 'Not Available' }}</p>
          </div>

          <div class="info-group">
            <label>Role</label>
            <p class="role-text" :class="currentUser?.role">
              {{ currentUser?.role?.toUpperCase() || 'Not Available' }}
            </p>
          </div>

          <!-- Permissions Section -->
          <div class="permissions-section">
            <label>Permissions</label>
            <div class="permissions-list">
              <div 
                v-for="permission in userPermissions" 
                :key="permission"
                class="permission-badge"
              >
                {{ formatPermissionName(permission) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  width: 800px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-button:hover {
  background-color: #f3f4f6;
}

.modal-content {
  display: flex;
  gap: 32px;
}

.profile-picture-section {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: #2563eb;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: bold;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: #fef3c7;
  color: #92400e;
}

.role-badge.user {
  background-color: #e0e7ff;
  color: #3730a3;
}

.profile-info-section {
  flex: 1;
}

.info-group {
  margin-bottom: 24px;
}

.info-group label {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.info-group p {
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
}

.role-text {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.role-text.admin {
  background-color: #fef3c7;
  color: #92400e;
}

.role-text.user {
  background-color: #e0e7ff;
  color: #3730a3;
}

/* New Permissions Styles */
.permissions-section {
  margin-top: 24px;
}

.permissions-section label {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-badge {
  background-color: #f3f4f6;
  color: #374151;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.permission-badge:hover {
  background-color: #e5e7eb;
}

@media (max-width: 640px) {
  .modal-content {
    flex-direction: column;
  }

  .profile-picture-section {
    flex: 0 0 auto;
  }
}
</style>
