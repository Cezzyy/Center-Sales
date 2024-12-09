import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { setupRouteGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'login', 
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    { 
      path: '/home', 
      name: 'home', 
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/about', 
      name: 'about', 
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    { 
      path: '/contacts', 
      name: 'contact', 
      component: () => import('../views/ContactView.vue'),
      meta: { requiresAuth: false }
    },
    { 
      path: '/admin', 
      name: 'admin', 
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin', 'manager'] }
    },
    { 
      path: '/unauthorized', 
      name: 'unauthorized', 
      component: () => import('../views/UnauthorizedView.vue')
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check authentication status on first navigation
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  // Handle login page redirection
  if (to.name === 'login' && authStore.isAuthenticated) {
    next(['admin', 'manager'].includes(authStore.user?.role) ? { name: 'admin' } : { name: 'home' })
    return
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }

  // Check for role-based access
  if (to.meta.allowedRoles) {
    const userRole = authStore.user?.role
    if (!userRole || !to.meta.allowedRoles.includes(userRole)) {
      next({ name: 'unauthorized' })
      return
    }
  }

  next()
})

// Setup route guards
setupRouteGuards(router)

export default router
