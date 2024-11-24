<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  const account = mockAccounts.find(
    (acc) => acc.username === username.value && acc.password === password.value
  );

  if (account) {
    console.log('Login successful:', account);
    // Navigate to /home and pass user data as state
    localStorage.setItem('isAuthenticated', true);
    router.push({
      path: '/home',
      state: { user: account },
    });
  } else {
    alert('Invalid username or password');
  }
};

//Mock user accounts
const mockAccounts = [
  {
    username: 'john_doe',
    password: '123456',
    firstName: 'John',
    lastName: 'Doe',
    position: 'Sales Manager',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
  },
  {
    username: 'jane_smith',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    position: 'Client Manager',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
  },
];
</script>

<template>
  <div class="login-container">
    <!-- Header -->
    <header class="header">
      <nav class="nav-links">
        <router-link to="/about">About</router-link>
        <router-link to="/contacts">Contacts</router-link>
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
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="Enter your username"
                required
              >
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  placeholder="Enter your password"
                  required
                >
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword= !showPassword"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>

            <a href="#forgot-password" class="forgot-password">Forgot Password?</a>

            <button type="submit" class="login-button">Login</button>
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
}

/* Header Styles */
.header {
  padding: 1.5rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #2563eb;
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

.forgot-password {
  display: block;
  text-align: right;
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.forgot-password:hover {
  text-decoration: underline;
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
