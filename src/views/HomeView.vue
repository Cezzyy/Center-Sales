<script setup>
import { ref, defineAsyncComponent } from 'vue'
const HomeDashboard = defineAsyncComponent(() => import('../components/HomeDashboard.vue'))
const Clients = defineAsyncComponent(() => import('../components/ClientsList.vue'))
const Sales = defineAsyncComponent(() => import('../components/SalesTracking.vue'))
const Reports = defineAsyncComponent(() => import('../components/ReportsOverview.vue'))
const Products = defineAsyncComponent(() => import('../components/ProductsList.vue'))
const ProfileModal = defineAsyncComponent(() => import('../components/ProfileModal.vue'))
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

const isSidebarOpen = ref(false)
const currentView = ref('Dashboard')
const isProfileModalVisible = ref(false)

const setView = (view) => currentView.value = view
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="icon" @click="isSidebarOpen = !isSidebarOpen">
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
    <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <nav class="nav-menu">
        <a href="#" class="nav-item" @click="setView('Dashboard')">
          <font-awesome-icon :icon="['fas', 'chart-simple']" class="nav-icon" />
          Dashboard
        </a>
        <a href="#" class="nav-item" @click="setView('Clients')">
          <font-awesome-icon :icon="['fas', 'person']" class="nav-icon" />
          Clients
        </a>
        <a href="#" class="nav-item" @click="setView('Sales')">
          <font-awesome-icon :icon="['fas', 'suitcase']" class="nav-icon" />
          Sales
        </a>
        <a href="#" class="nav-item" @click="setView('Reports')">
          <font-awesome-icon :icon="['fas', 'square-poll-horizontal']" class="nav-icon" />
          Reports
        </a>
        <a href="#" class="nav-item" @click="setView('Products')">
          <font-awesome-icon :icon="['fas', 'boxes-stacked']" class="nav-icon" />
          Products
        </a>
      </nav>
      <div class="logout-container">
        <a href="#" class="nav-item logout-button">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="nav-icon" />
          Logout
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <component :is="currentView === 'Dashboard' ? HomeDashboard : null" />
      <component :is="currentView === 'Clients' ? Clients : null" />
      <component :is="currentView === 'Sales' ? Sales : null" />
      <component :is="currentView === 'Reports' ? Reports : null" />
      <component :is="currentView === 'Products' ? Products : null" />
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #2563eb;
  --background-color: #f8fafc;
  --text-color: #1e293b;
  --sidebar-width: 250px;
  --header-height: 64px;
}

h1 {
  color: var(--text-color);
  font-size: 2rem;
}

.layout {
  min-height: 100vh;
  background-color: var(--background-color);
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: var(--header-height);
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
  font-weight: 500;
  color: var(--text-color);
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
  color: var(--text-color);
}

.sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: white;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
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
  padding: 0.75rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
  gap: 0.75rem;
}

.nav-item:hover {
  background-color: var(--background-color);
}

.nav-icon {
  font-size: 1.25rem;
}

.logout-container {
  border-top: 1px solid #e2e8f0;
  padding: 1rem 0;
}

.logout-button {
  color: #ef4444;
}

.logout-button:hover {
  background-color: #fee2e2;
}

.main-content {
  padding: calc(var(--header-height) + 2rem) 2rem 2rem;
  transition: margin-left 0.3s ease;
}

.content-shifted {
  margin-left: var(--sidebar-width);
}

@media (max-width: 768px) {
  .content-shifted {
    margin-left: 0;
  }

  .sidebar {
    z-index: 90;
  }
}
</style>
