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
      meta: { requiresAuth: true, requiredPermissions: ['manage_users', 'manage_roles'] }
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
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  // Redirect to appropriate page if already logged in and trying to access login page
  if (to.name === 'login' && authStore.isAuthenticated) {
    next(authStore.isAdmin ? { name: 'admin' } : { name: 'home' })
    return
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
  } else {
    next()
  }
})

// Setup route guards
setupRouteGuards(router)

export default router
