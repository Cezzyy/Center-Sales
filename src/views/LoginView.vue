<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')

const validateForm = () => {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''
  errorMessage.value = ''

  // Email validation
  if (!email.value) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      if (authStore.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/home')
      }
    } else {
      errorMessage.value = 'Invalid email or password'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login'
    console.error('Login error:', error)
  }
}
</script>

<template>
  <div class="login-container">
    <!-- Header -->
    <header class="header">
      <div class="logo-small">
        <img src="/src/assets/centerlogo.jpg" alt="Company Logo" class="small-logo">
      </div>
      <nav class="nav-links">
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contacts" class="nav-link">Contacts</router-link>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Left Side - Logo and Welcome -->
      <div class="left-side">
        <div class="logo-container">
          <img src="/src/assets/centerlogo.jpg" alt="Company Logo" class="logo">
          <h2 class="welcome-text">Sales & Client Management System</h2>
          <p class="sub-text">Welcome to the Sales & Client Management System! We're glad to have you back.
            Please log in to access your dashboard and manage your tasks efficiently.</p>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="right-side">
        <div class="form-container">
          <h1>Login</h1>
          <form @submit.prevent="handleLogin" novalidate>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Enter your email"
                :class="{ 'error-input': emailError }"
              >
              <span v-if="emailError" class="error-text">{{ emailError }}</span>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  placeholder="Enter your password"
                  :class="{ 'error-input': passwordError }"
                >
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button type="submit" class="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Container */
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px; /* Add space for fixed header */
}

/* Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo-small {
  height: 40px;
}

.small-logo {
  height: 100%;
  object-fit: contain;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f5f5f5;
  color: #1a73e8;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  padding: 2rem;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}

/* Left Side */
.left-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.logo-container {
  text-align: center;
}

.logo {
  width: 400px;
  height: 200px;
  margin-bottom: 1.5rem;
}

.welcome-text {
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.sub-text {
  color: #6b7280;
}

/* Right Side */
.right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-container h1 {
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.error-input {
  border-color: #dc2626 !important;
  background-color: #fff5f5;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.error-message {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #1d4ed8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 1rem;
  }

  .left-side, .right-side {
    padding: 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .welcome-text {
    font-size: 1.5rem;
  }
}
</style>
