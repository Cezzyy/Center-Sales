<script setup>
import { defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'
const HomeDashboard = defineAsyncComponent(() => import('../components/UserComponents/HomeDashboard.vue'))
const Clients = defineAsyncComponent(() => import('../components/UserComponents/ClientsList.vue'))
const Sales = defineAsyncComponent(() => import('../components/UserComponents/SalesTracking.vue'))
const Reports = defineAsyncComponent(() => import('../components/UserComponents/ReportsOverview.vue'))
const Products = defineAsyncComponent(() => import("../components/UserComponents/ProductsList.vue"))
const ProfileModal =  defineAsyncComponent(() => import('../components/UserSideModals/ProfileModal.vue'))

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChartSimple,
  faPerson,
  faSuitcase,
  faSquarePollHorizontal,
  faBoxesStacked,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChartSimple,
  faPerson,
  faSuitcase,
  faSquarePollHorizontal,
  faBoxesStacked,
  faSignOutAlt,
)

import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const isSidebarOpen = ref(false)
const currentView = ref('Dashboard')
const isProfileModalVisible = ref(false)

const setView = (view) => currentView.value = view

const closeOnClickOutside = (e) => {
  const sidebar = document.querySelector('.sidebar')
  const menuButton = document.querySelector('.menu-button')
  if (isSidebarOpen.value && sidebar && !sidebar.contains(e.target) && !menuButton.contains(e.target)) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="icon menu-button" @click="isSidebarOpen = !isSidebarOpen">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <div class="section-title">{{ currentView }}</div>
      </div>
      <div class="header-icons">
        <div class="icon" @click="isProfileModalVisible = !isProfileModalVisible">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <ProfileModal
            v-if="isProfileModalVisible"
            @close="isProfileModalVisible = false"
            :isOpen="isProfileModalVisible"
          />
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
      <nav class="nav-menu">
        <a href="#" class="nav-item" @click="setView('Dashboard')">
          <font-awesome-icon :icon="['fas', 'chart-simple']" class="nav-icon" />
          <span class="nav-text">Dashboard</span>
        </a>
        <a href="#" class="nav-item" @click="setView('Clients')">
          <font-awesome-icon :icon="['fas', 'person']" class="nav-icon" />
          <span class="nav-text">Clients</span>
        </a>
        <a href="#" class="nav-item" @click="setView('Sales')">
          <font-awesome-icon :icon="['fas', 'suitcase']" class="nav-icon" />
          <span class="nav-text">Sales</span>
        </a>
        <a href="#" class="nav-item" @click="setView('Reports')">
          <font-awesome-icon :icon="['fas', 'square-poll-horizontal']" class="nav-icon" />
          <span class="nav-text">Reports</span>
        </a>
        <a href="#" class="nav-item" @click="setView('Products')">
          <font-awesome-icon :icon="['fas', 'boxes-stacked']" class="nav-icon" />
          <span class="nav-text">Products</span>
        </a>
        <div class="nav-item logout" @click="handleLogout">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="nav-icon" />
          <span class="nav-text">Logout</span>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <HomeDashboard v-if="currentView === 'Dashboard'" />
      <Clients v-if="currentView === 'Clients'" />
      <Sales v-if="currentView === 'Sales'" />
      <Reports v-if="currentView === 'Reports'" />
      <Products v-if="currentView === 'Products'" />
    </main>
  </div>
</template>

<style scoped>
h1 {
  color: rgb(30, 41, 59);
  font-size: 2rem;
}

.layout {
  min-height: 100vh;
  background-color: #f8fafc;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 64px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(30, 41, 59);
}

.header-icons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: rgb(30, 41, 59)
}

.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 280px;
  background: white;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 50;
}

.sidebar-open {
  transform: translateX(0);
}

.nav-menu {
  padding: 1rem 0;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.75rem;
  color: rgb(30, 41, 59);
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #2563eb;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background-color: #f8fafc;
  color: #2563eb;
}

.nav-item:hover::before {
  transform: scaleY(1);
}

.nav-icon {
  font-size: 1.25rem;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  font-weight: 500;
  font-size: 0.9375rem;
  letter-spacing: 0.01em;
}

.logout {
  margin-top: auto;
  color: #dc2626;
}

.logout:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.main-content {
  padding: calc(64px + 2rem) 2rem 2rem;
  transition: margin-left 0.3s ease;
  background: rgb(248, 250, 252);
}

@media (max-width: 768px) {
  .sidebar {
    z-index: 90;
  }
}
</style>
