import { defineStore } from 'pinia'

// Mock user accounts
const mockUsers = [
  {
    id: 1,
    email: 'admin@center.com',
    password: 'admin123',
    role: 'admin',
    username: 'Admin User',
    position: 'System Administrator'
  },
  {
    id: 2,
    email: 'manager@center.com',
    password: 'manager123',
    role: 'admin',
    username: 'Sales Manager',
    position: 'Sales Manager'
  },
  {
    id: 3,
    email: 'sales@center.com',
    password: 'sales123',
    role: 'user',
    username: 'Sales Staff',
    position: 'Sales Representative'
  },
  {
    id: 4,
    email: 'clerk@center.com',
    password: 'clerk123',
    role: 'user',
    username: 'Sales Clerk',
    position: 'Sales Clerk'
  }
]

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      isAuthenticated: !!token && !!storedUser,
      token: token || null
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user',
    currentUser: (state) => state.user
  },

  actions: {
    async login(email, password) {
      try {
        // Find user in mock database
        const user = mockUsers.find(u => u.email === email && u.password === password)
        
        if (!user) {
          return { success: false, error: 'Invalid credentials' }
        }

        // Generate mock token (in real app, this would come from backend)
        const token = btoa(`${user.email}:${user.role}:${Date.now()}`)
        
        // Set user state
        this.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          username: user.username,
          position: user.position
        }
        this.isAuthenticated = true
        this.token = token
        
        // Store auth data in localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return { success: true, user: this.user }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: error.message }
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },

    async checkAuth() {
      const token = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser)
          
          // Validate token format (in a real app, you'd verify with backend)
          const [email, role, timestamp] = atob(token).split(':')
          if (!email || !role || !timestamp) {
            throw new Error('Invalid token format')
          }
          
          this.user = user
          this.isAuthenticated = true
          this.token = token
          return true
        } catch (error) {
          console.error('Error checking auth:', error)
          this.logout()
          return false
        }
      }
      return false
    }
  }
})
