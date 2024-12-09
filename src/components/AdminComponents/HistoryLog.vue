<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { LogService } from '@/services/logService'

// Action categories for filtering
const actionCategories = [
  { value: 'all', label: 'All Actions' },
  { value: 'client', label: 'Client Management' },
  { value: 'sale', label: 'Sales' },
  { value: 'product', label: 'Products' },
  { value: 'user', label: 'User Management' },
  { value: 'role', label: 'Role Management' },
]

// State Management
const historyLogs = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedDateRange = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const startDate = ref(null)
const endDate = ref(null)

// Timestamp formatting
const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting timestamp:', error)
    return timestamp
  }
}

// Fetch logs from service
const fetchLogs = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Only apply date filters here, other filters are handled by computed properties
    const filters = {
      startDate: startDate.value,
      endDate: endDate.value
    }
    
    const logs = await LogService.getLogs(filters)
    console.log('Fetched logs:', logs)
    historyLogs.value = logs
  } catch (e) {
    error.value = 'Failed to fetch activity logs'
    console.error('Error fetching logs:', e)
  } finally {
    isLoading.value = false
  }
}

// Computed Properties
const filteredLogs = computed(() => {
  let filtered = historyLogs.value
  console.log('Filtering logs:', filtered)

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((log) => {
      return (
        log.details?.toLowerCase().includes(query) ||
        log.username?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.category?.toLowerCase().includes(query)
      )
    })
  }

  // Category filter
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((log) => log.category === selectedCategory.value)
  }

  // Date range filter
  if (selectedDateRange.value !== 'all' && selectedDateRange.value !== 'custom') {
    const now = new Date()
    filtered = filtered.filter((log) => {
      const logDate = new Date(log.timestamp)
      
      switch (selectedDateRange.value) {
        case 'today':
          return isSameDay(logDate, now)
        case 'week':
          return isWithinLastWeek(logDate)
        case 'month':
          return isWithinLastMonth(logDate)
        default:
          return true
      }
    })
  }

  console.log('Filtered logs:', filtered)
  return filtered
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLogs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / itemsPerPage.value)
})

// Date Helper Functions
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isWithinLastWeek = (date) => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return date >= weekAgo
}

const isWithinLastMonth = (date) => {
  const now = new Date()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return date >= monthAgo
}

// UI Helper Functions
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleSearch = (event) => {
  searchQuery.value = event.target.value
  currentPage.value = 1
}

const handleCategoryChange = async (event) => {
  selectedCategory.value = event.target.value
  currentPage.value = 1
  await fetchLogs()
}

const handleDateRangeChange = async (event) => {
  selectedDateRange.value = event.target.value
  if (event.target.value !== 'custom') {
    startDate.value = null
    endDate.value = null
    await fetchLogs()
  }
  currentPage.value = 1
}

const handleCustomDateChange = async () => {
  if (startDate.value && endDate.value) {
    selectedDateRange.value = 'custom'
    currentPage.value = 1
    await fetchLogs()
  }
}

// Action Color Mapping
const getActionColor = (action) => {
  const colorMap = {
    CREATE: 'success',
    UPDATE: 'warning',
    DELETE: 'danger',
  }
  const actionType = action.split('_')[0]
  return colorMap[actionType] || 'info'
}

// Watchers
watch([searchQuery], () => {
  currentPage.value = 1
})

watch([selectedCategory, selectedDateRange], () => {
  fetchLogs()
})

watch([startDate, endDate], () => {
  if (selectedDateRange.value === 'custom') {
    fetchLogs()
  }
})

// Initial load
onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <section class="history-log">
    <!-- Header Section -->
    <header class="history-log__header">
      <h1 class="history-log__title">Activity History</h1>
      <p class="history-log__subtitle">Track and monitor system activities</p>
    </header>

    <!-- Filters Section -->
    <div class="history-log__filters">
      <div class="history-log__search">
        <input
          type="text"
          placeholder="Search logs..."
          v-model="searchQuery"
          @input="handleSearch"
        />
      </div>

      <div class="history-log__filter-group">
        <select v-model="selectedCategory" @change="handleCategoryChange">
          <option
            v-for="category in actionCategories"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
          </option>
        </select>

        <select v-model="selectedDateRange" @change="handleDateRangeChange">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </select>

        <div v-if="selectedDateRange === 'custom'" class="history-log__date-range">
          <input
            type="date"
            v-model="startDate"
            @change="handleCustomDateChange"
            placeholder="Start Date"
          />
          <input
            type="date"
            v-model="endDate"
            @change="handleCustomDateChange"
            placeholder="End Date"
          />
        </div>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="history-log__table-container">
      <table class="history-log__table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in paginatedLogs" :key="log.id">
            <td class="history-log__timestamp">{{ formatTimestamp(log.timestamp) }}</td>
            <td class="history-log__user">{{ log.username }}</td>
            <td class="history-log__action">
              <span
                class="history-log__action-badge"
                :class="'history-log__action-badge--' + getActionColor(log.action)"
              >
                {{ log.action.replace('_', ' ') }}
              </span>
            </td>
            <td class="history-log__details">{{ log.details }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="history-log__loading">
      Loading activity logs...
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && filteredLogs.length === 0" class="history-log__empty">
      No activity logs found.
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="history-log__pagination">
      <button
        class="history-log__page-btn"
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        &laquo;
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="history-log__page-btn"
        :class="{ active: currentPage === page }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
      <button
        class="history-log__page-btn"
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        &raquo;
      </button>
    </nav>
  </section>
</template>

<style scoped>
.history-log {
  padding: 2rem;
  max-width: 100%;
}

.history-log__header {
  margin-bottom: 2rem;
}

.history-log__title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.history-log__subtitle {
  color: #666;
  font-size: 1rem;
}

.history-log__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.history-log__search {
  flex: 1;
  min-width: 250px;
}

.history-log__search input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.history-log__filter-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.history-log__filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
}

.history-log__date-range {
  display: flex;
  gap: 0.5rem;
}

.history-log__date-range input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.history-log__table-container {
  overflow-x: auto;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.history-log__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.history-log__table th,
.history-log__table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.history-log__table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.history-log__timestamp {
  white-space: nowrap;
  color: #666;
}

.history-log__user {
  font-weight: 500;
}

.history-log__action-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.history-log__action-badge--success {
  background-color: #d3f9d8;
  color: #2b8a3e;
}

.history-log__action-badge--warning {
  background-color: #fff3bf;
  color: #f08c00;
}

.history-log__action-badge--danger {
  background-color: #ffe3e3;
  color: #e03131;
}

.history-log__action-badge--info {
  background-color: #e7f5ff;
  color: #1971c2;
}

.history-log__details {
  color: #495057;
}

.history-log__pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.history-log__page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.history-log__page-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.history-log__page-btn.active {
  background-color: #339af0;
  color: white;
  border-color: #339af0;
}

.history-log__page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.history-log__loading,
.history-log__empty {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .history-log {
    padding: 1rem;
  }

  .history-log__filters {
    flex-direction: column;
  }

  .history-log__search {
    width: 100%;
  }

  .history-log__filter-group {
    width: 100%;
  }

  .history-log__date-range {
    flex-direction: column;
    width: 100%;
  }
}
</style>