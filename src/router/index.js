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

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const allowedRoles = to.matched.some(record => record.meta.allowedRoles)?.meta?.allowedRoles || []

  // Redirect to appropriate page if already logged in and trying to access login page
  if (to.name === 'login' && authStore.isAuthenticated) {
    next(['admin', 'manager'].includes(authStore.user?.role) ? { name: 'admin' } : { name: 'home' })
    return
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (allowedRoles.length > 0 && !allowedRoles.includes(authStore.user?.role)) {
    next({ name: 'unauthorized' })
  } else {
    next()
  }
})

// Setup route guards
setupRouteGuards(router)

export default router
