import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

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
      meta: { requiresAuth: true }
    },
    { 
      path: '/contacts', 
      name: 'contact', 
      component: () => import('../views/ContactView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/admin', 
      name: 'admin', 
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
