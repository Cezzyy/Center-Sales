import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    // Define all available permissions
    availablePermissions: {
      read: { name: 'Read Access', description: 'Can view resources' },
      write: { name: 'Write Access', description: 'Can create and edit resources' },
      delete: { name: 'Delete Access', description: 'Can delete resources' },
      manage_users: { name: 'Manage Users', description: 'Can manage user accounts' },
      manage_roles: { name: 'Manage Roles', description: 'Can manage roles and permissions' },
      view_reports: { name: 'View Reports', description: 'Can view reports and analytics' },
      export_data: { name: 'Export Data', description: 'Can export data from the system' },
      manage_settings: { name: 'Manage Settings', description: 'Can modify system settings' },
    },

    // Define role-permission mappings and descriptions
    rolePermissions: {
      admin: {
        permissions: [
          'read',
          'write',
          'delete',
          'manage_users',
          'manage_roles',
          'view_reports',
          'export_data',
          'manage_settings',
        ],
        description: 'Full system access',
      },
      manager: {
        permissions: ['read', 'write', 'delete', 'manage_users', 'view_reports', 'export_data'],
        description: 'Department management access',
      },
      general_staff: {
        permissions: ['read', 'write', 'view_reports', 'export_data'],
        description: 'Staff access with basic permissions',
      },
      user: {
        permissions: ['read'],
        description: 'Basic user access',
      },
    },
  }),

  getters: {
    // Get permissions for current user's role
    currentUserPermissions: (state) => {
      const authStore = useAuthStore()
      const userRole = authStore.user?.role
      return userRole ? state.rolePermissions[userRole]?.permissions || [] : []
    },

    // Check if user has specific permission
    hasPermission: (state) => (permission) => {
      const authStore = useAuthStore()
      const userRole = authStore.user?.role
      return userRole && state.rolePermissions[userRole]?.permissions?.includes(permission)
    },

    // Check if user has all specified permissions
    hasAllPermissions: (state) => (permissions) => {
      const authStore = useAuthStore()
      const userRole = authStore.user?.role
      return (
        userRole &&
        permissions.every((permission) =>
          state.rolePermissions[userRole]?.permissions?.includes(permission),
        )
      )
    },

    // Get all available permissions list
    getAllPermissions: (state) =>
      Object.entries(state.availablePermissions).map(([id, details]) => ({ id, ...details })),

    // Get permissions for a specific role
    getRolePermissions: (state) => (role) => state.rolePermissions[role]?.permissions || [],

    // Get role description
    getRoleDescription: (state) => (role) => state.rolePermissions[role]?.description || '',
  },

  actions: {
    // Update role permissions and description
    updateRolePermissions(role, permissions, description) {
      if (role) {
        if (!this.rolePermissions[role]) {
          this.rolePermissions[role] = { permissions: [], description: '' }
        }
        if (Array.isArray(permissions)) {
          this.rolePermissions[role].permissions = permissions
        }
        if (description !== undefined) {
          this.rolePermissions[role].description = description
        }
      }
    },

    // Add a new role with permissions and description
    addRole(role, permissions, description = '') {
      if (role && Array.isArray(permissions)) {
        this.rolePermissions[role] = {
          permissions,
          description,
        }
      }
    },

    // Remove a role and its permissions
    removeRole(role) {
      if (role && role !== 'admin') {
        // Prevent removing admin role
        delete this.rolePermissions[role]
      }
    },

    // Check if a permission exists
    isValidPermission(permission) {
      return Object.keys(this.availablePermissions).includes(permission)
    },
  },
})
