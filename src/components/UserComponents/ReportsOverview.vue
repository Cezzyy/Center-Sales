<script setup>
import { ref, computed, watch, defineAsyncComponent, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reportsStore'
import { useOrderInvoiceStore } from '@/stores/salesStore'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons'
import { storeToRefs } from 'pinia'

library.add(faChartLine, faPlus, faEdit)

import { useActivityLog } from '@/composables/useActivityLog'
import { usePermissions } from '@/composables/usePermissions'

// Get stores, activity logger, and permissions
const reportsStore = useReportsStore()
const orderStore = useOrderInvoiceStore()
const activityLog = useActivityLog()
const { logAction } = activityLog
const { can } = usePermissions()

// Destructure store state with storeToRefs for reactivity
const { reports, isLoading, error } = storeToRefs(reportsStore)

const AddReportModal = defineAsyncComponent(() => import('../UserSideModals/AddReportModal.vue'))
const EditReportModal = defineAsyncComponent(() => import('../UserSideModals/EditReportModal.vue'))

// Reactive references for filters and pagination
const startDate = ref('')
const endDate = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref('date')
const sortDirection = ref('desc')
const showAddReportModal = ref(false)
const showEditReportModal = ref(false)
const selectedReport = ref(null)

// Notification state
const notification = ref({
  show: false,
  message: '',
  type: 'success', // or 'error'
})

const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type,
  }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const handleUpdateSuccess = async ({ message, report }) => {
  try {
    await reportsStore.updateReport(report.reportId, report)
    showNotification(message || 'Report updated successfully')
    await logAction('UPDATE_REPORT', `Updated report ${report.reportId}`)
    closeEditModal()
  } catch (error) {
    handleUpdateError({ message: error.message, error })
  }
}

const handleUpdateError = ({ message, error }) => {
  showNotification(message || 'Error updating report', 'error')
  console.error('Error updating report:', error)
}

const editReport = (report) => {
  selectedReport.value = { ...report }
  showEditReportModal.value = true
}

const closeEditModal = () => {
  showEditReportModal.value = false
  selectedReport.value = null
}

// Fetch data on component mount
onMounted(async () => {
  try {
    await reportsStore.fetchReports()
    await orderStore.fetchOrders() // We might need orders data for the add report modal
  } catch (error) {
    console.error('Error fetching initial data:', error)
  }
})

// Computed Properties
const filteredReports = computed(() => reportsStore.filteredReports)
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredReports.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage.value))
const totalRevenue = computed(() => reportsStore.totalRevenue)
const averageOrderValue = computed(() => reportsStore.averageOrderValue)

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Methods
const handleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
  reportsStore.handleSort(column)
  logAction({
    action: 'SORT_REPORTS',
    category: 'reports',
    details: `Reports sorted by ${column} in ${sortDirection.value} order`,
    additionalData: { column, direction: sortDirection.value },
  })
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
  logAction({
    action: 'CHANGE_PAGE',
    category: 'reports',
    details: `Navigated to reports page ${page}`,
    additionalData: { page, totalPages: totalPages.value },
  })
}

// Watch for filter changes
watch([startDate, endDate, searchQuery], () => {
  currentPage.value = 1
  reportsStore.setDateFilter(startDate.value, endDate.value)
  reportsStore.setSearchQuery(searchQuery.value)
})

// Report management methods
const addReport = async (reportData) => {
  try {
    await reportsStore.addReport(reportData)
    showAddReportModal.value = false
    logAction({
      action: 'ADD_REPORT',
      category: 'reports',
      details: `Added new report for ${reportData.customerName}`,
    })
  } catch (error) {
    console.error('Error adding report:', error)
    alert(error.message)
  }
}

const exportToExcel = async () => {
  if (!can.exportData()) {
    console.error('Permission denied: Cannot export data')
    return
  }

  try {
    const ws = XLSX.utils.json_to_sheet(reports.value)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reports')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    saveAs(data, 'reports.xlsx')

    logAction({
      action: 'EXPORT_REPORTS',
      category: 'reports',
      details: 'Exported reports to Excel format',
      additionalData: {
        format: 'xlsx',
        count: reports.value.length,
        dateRange: { start: startDate.value, end: endDate.value },
      },
    })
  } catch (error) {
    console.error('Failed to export to Excel:', error)
  }
}

const exportToCSV = async () => {
  if (!can.exportData()) {
    console.error('Permission denied: Cannot export data')
    return
  }

  try {
    const csvContent = reports.value.map((report) => Object.values(report).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'reports.csv')

    logAction({
      action: 'EXPORT_REPORTS',
      category: 'reports',
      details: 'Exported reports to CSV format',
      additionalData: {
        format: 'csv',
        count: reports.value.length,
        dateRange: { start: startDate.value, end: endDate.value },
      },
    })
  } catch (error) {
    console.error('Failed to export to CSV:', error)
  }
}
</script>

<template>
  <div class="reports-overview">
    <!-- Loading and Error States -->
    <div v-if="isLoading" class="loading-state">
      <span class="loader"></span>
      Loading reports...
    </div>

    <div v-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
    </div>

    <!-- Filters Section -->
    <section v-if="!isLoading" class="filters-section">
      <div class="date-filters">
        <div class="filter-group">
          <label for="startDate">From:</label>
          <input type="date" id="startDate" v-model="startDate" :max="endDate || undefined" />
        </div>
        <div class="filter-group">
          <label for="endDate">To:</label>
          <input type="date" id="endDate" v-model="endDate" :min="startDate || undefined" />
        </div>
      </div>

      <div class="search-export">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="Search reports..." />
        </div>

        <div class="export-buttons">
          <button v-if="can.exportData()" @click="exportToExcel" class="btn-export">
            Export to Excel
          </button>
          <button v-if="can.exportData()" @click="exportToCSV" class="btn-export">
            Export to CSV
          </button>
          <button v-if="can.write()" @click="showAddReportModal = true" class="btn-add">
            Add Report
          </button>
        </div>
      </div>
    </section>

    <!-- Metrics Section -->
    <section v-if="!isLoading" class="metrics-section">
      <div class="metric-card">
        <h3>Total Reports</h3>
        <p>{{ reports.length }}</p>
      </div>
      <div class="metric-card">
        <h3>Total Revenue</h3>
        <p>₱{{ totalRevenue.toLocaleString() }}</p>
      </div>
      <div class="metric-card">
        <h3>Average Order Value</h3>
        <p>₱{{ averageOrderValue.toLocaleString() }}</p>
      </div>
    </section>

    <!-- Table Section -->
    <section v-if="!isLoading && paginatedReports.length > 0" class="table-section">
      <table class="reports-table" v-if="reports.length > 0">
        <thead>
          <tr>
            <th @click="handleSort('reportId')">Report ID</th>
            <th @click="handleSort('orderId')">Order ID</th>
            <th @click="handleSort('customerName')">Customer Name</th>
            <th @click="handleSort('productName')">Product</th>
            <th @click="handleSort('quantity')">Quantity</th>
            <th @click="handleSort('amount')">Amount</th>
            <th @click="handleSort('salesRep')">Sales Rep</th>
            <th @click="handleSort('orderDate')">Order Date</th>
            <th @click="handleSort('dueDate')">Due Date</th>
            <th @click="handleSort('status')">Status</th>
            <th @click="handleSort('paymentStatus')">Payment Status</th>
            <th v-if="can.write()">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in paginatedReports" :key="report.reportId">
            <td>{{ report.reportId }}</td>
            <td>{{ report.orderId }}</td>
            <td>{{ report.customerName }}</td>
            <td>{{ report.productName }}</td>
            <td>{{ report.quantity }}</td>
            <td>₱{{ report.amount.toLocaleString() }}</td>
            <td>{{ report.salesRep }}</td>
            <td>{{ report.orderDate }}</td>
            <td>{{ report.dueDate }}</td>
            <td>{{ report.status }}</td>
            <td>{{ report.paymentStatus }}</td>
            <td v-if="can.write()">
              <button class="btn-edit" @click="editReport(report)">
                <font-awesome-icon icon="fa-solid fa-edit" class="edit-icon" />
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-state__content">
          <div class="empty-state__icon-wrapper">
            <font-awesome-icon :icon="faChartLine" class="empty-state__icon" />
          </div>
          <h3 class="empty-state__title">No Reports Found</h3>
          <p class="empty-state__message">
            There are no reports matching your current filters. Try adjusting your search criteria
            or add a new report.
          </p>
          <button
            v-if="can.write()"
            @click="showAddReportModal = true"
            class="btn-add empty-state__button"
          >
            <font-awesome-icon :icon="faPlus" />
            Add New Report
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="reports.length > 0">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="btn-page">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="btn-page"
        >
          Next
        </button>
      </div>
    </section>

    <!-- Add Report Modal -->
    <AddReportModal v-model="showAddReportModal" :orders="orderStore.orders" @submit="addReport" />

    <!-- Edit Report Modal -->
    <EditReportModal
      v-if="showEditReportModal"
      :isOpen="showEditReportModal"
      :report="selectedReport"
      @close="closeEditModal"
      @update:success="handleUpdateSuccess"
      @update:error="handleUpdateError"
    />
    <!-- Snackbar for notifications -->
    <div v-if="notification.show" :class="['snackbar', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<style scoped>
.reports-overview {
  padding: 2rem;
  background-color: #f8f9fa;
}
.filters-section {
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.date-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 50%;
}

.filter-group label {
  color: #6c757d;
  font-weight: 500;
}

.filter-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.search-export {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.export-buttons {
  display: flex;
  gap: 1rem;
}

.btn-export,
.btn-add {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-export {
  background-color: #3b82f6;
  color: white;
}

.btn-export:hover {
  opacity: 0.9;
}

.btn-add {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add:hover {
  background-color: #2563eb;
}

.btn-add:active {
  transform: translateY(0);
}

.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.metric-card h3 {
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.metric-card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #212529;
  margin: 0;
}

.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th,
.reports-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.reports-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reports-table th:hover {
  background-color: #e9ecef;
}

.reports-table tbody tr:hover {
  background-color: #f8f9fa;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page:not(:disabled):hover {
  background-color: #f5f5f5;
}

/* Status styles */
.status-pending {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}

.status-unpaid {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}

.status-paid {
  background-color: #d4edda;
  color: #155724;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reports-overview {
    padding: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .date-filters {
    flex-direction: column;
  }

  .search-export {
    flex-direction: column;
    gap: 1rem;
  }

  .search-box input {
    width: 100%;
  }

  .export-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn-export,
  .btn-add {
    width: 100%;
  }

  .reports-table {
    font-size: 0.875rem;
  }

  .reports-table th,
  .reports-table td {
    padding: 0.75rem;
  }
}

.empty-state {
  background: white;
  border-radius: 8px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state__content {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state__icon-wrapper {
  background: rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.empty-state__icon {
  font-size: 2.5rem;
  color: #4f46e5;
}

.empty-state__title {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.empty-state__message {
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 1.5rem;
  font-size: 1rem;
}

.empty-state__button {
  min-width: 200px;
  justify-content: center;
}

.empty-state__button svg {
  margin-right: 0.5rem;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background-color: #2563eb;
}

.edit-icon {
  font-size: 0.875rem;
}

.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
  transition: all 0.3s ease;
}

.snackbar.success {
  background-color: #4caf50;
}

.snackbar.error {
  background-color: #f44336;
}
</style>
