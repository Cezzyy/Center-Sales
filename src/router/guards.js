import { useAuthStore } from '@/stores/authStore'
import { usePermissionsStore } from '@/stores/permissionsStore'

export function setupRouteGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const permissionsStore = usePermissionsStore()
    
    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return next({ name: 'login' })
    }

    // Check if route requires specific permissions
    if (to.meta.requiredPermissions) {
      const hasPermission = permissionsStore.hasAllPermissions(to.meta.requiredPermissions)
      if (!hasPermission) {
        return next({ name: 'unauthorized' })
      }
    }

    // Check if route requires specific role
    if (to.meta.requiredRole) {
      const userRole = authStore.user?.role
      if (userRole !== to.meta.requiredRole) {
        return next({ name: 'unauthorized' })
      }
    }

    next()
  })
}
