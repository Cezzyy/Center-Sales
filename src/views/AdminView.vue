<script setup>
import { defineAsyncComponent, ref, computed } from "vue";
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const UserManagement = defineAsyncComponent(() => import("../components/AdminComponents/UserManagement.vue"));
const RoleManagement = defineAsyncComponent(() => import("../components/AdminComponents/RoleManagement.vue"));
const HistoryLog = defineAsyncComponent(() => import("../components/AdminComponents/HistoryLog.vue"));
const ProfileModal = defineAsyncComponent(() => import("../components/UserSideModals/ProfileModal.vue"));

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChartSimple,
  faPerson,
  faSuitcase,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faChartSimple,
  faPerson,
  faSuitcase,
  faSignOutAlt
);

const authStore = useAuthStore()
const router = useRouter()

const isSidebarOpen = ref(false);
const currentView = ref("User");
const isProfileModalVisible = ref(false);

// Update permission checks to include manager for User Management
const canManageUsers = computed(() => ['admin', 'manager'].includes(authStore.user?.role))
const canManageRoles = computed(() => authStore.user?.role === 'admin')

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleProfileModal = () => {
  isProfileModalVisible.value = !isProfileModalVisible.value;
};

const setView = (view) => {
  currentView.value = view;
};

const handleLogout = () => {
  authStore.logout()
  router.push('/')
};
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="icon" @click="toggleSidebar">
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
        <h1>Admin Dashboard</h1>
      </div>
      <div class="header-right">
        <div class="icon" @click="toggleProfileModal">
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
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
      <div class="nav-items">
        <div 
          v-if="canManageUsers"
          class="nav-item" 
          :class="{ active: currentView === 'User' }" 
          @click="setView('User')"
        >
          <font-awesome-icon icon="fa-solid fa-person" />
          <span>User Management</span>
        </div>
        <div 
          v-if="canManageRoles"
          class="nav-item" 
          :class="{ active: currentView === 'Role' }" 
          @click="setView('Role')"
        >
          <font-awesome-icon icon="fa-solid fa-suitcase" />
          <span>Role Management</span>
        </div>
        <div class="nav-item" :class="{ active: currentView === 'History' }" @click="setView('History')">
          <font-awesome-icon icon="fa-solid fa-chart-simple" />
          <span>History Log</span>
        </div>
        <div class="nav-item logout" @click="handleLogout">
          <font-awesome-icon icon="fa-solid fa-sign-out-alt" />
          <span>Logout</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <UserManagement v-if="currentView === 'User' && canManageUsers" />
      <RoleManagement v-if="currentView === 'Role' && canManageRoles" />
      <HistoryLog v-if="currentView === 'History'" />
      <div v-if="(currentView === 'User' && !canManageUsers) || (currentView === 'Role' && !canManageRoles)" 
           class="unauthorized-message">
        <h2>Unauthorized Access</h2>
        <p>You don't have permission to access this section.</p>
      </div>
    </main>

    <!-- Profile Modal -->
    <ProfileModal
      v-if="isProfileModalVisible"
      :isOpen="isProfileModalVisible"
      @close="toggleProfileModal"
    />
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

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  width: 250px;
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

.nav-items {
  padding: 1rem 0;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: rgb(30, 41, 59);
  text-decoration: none;
  transition: background-color 0.2s;
  gap: 0.75rem;
}

.nav-item:hover {
  background-color: rgb(248, 250, 252);
}

.nav-item.active {
  background-color: rgb(237, 242, 247);
}

.logout {
  margin-top: auto;
  color: #dc2626;
  cursor: pointer;
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

.unauthorized-message {
  padding: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .sidebar {
    z-index: 90;
  }
}
</style>
