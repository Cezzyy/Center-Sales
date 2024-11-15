<script setup>
import { ref, computed, watch } from 'vue'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// Sample data structure (replace with actual API calls in production)
const salesData = ref([
  {
    id: 'TRX-001',
    date: '2024-02-20',
    clientName: 'John Doe',
    productName: 'Product XYZ',
    quantity: 5,
    price: 99.99,
    salesRep: 'Jane Smith',
    category: 'Electronics',
  },
  {
    id: 'TRX-002',
    date: '2024-03-15',
    clientName: 'Alice Johnson',
    productName: 'Wireless Mouse',
    quantity: 10,
    price: 19.99,
    salesRep: 'Mark Lee',
    category: 'Accessories',
  },
  {
    id: 'TRX-003',
    date: '2024-03-20',
    clientName: 'Bob Brown',
    productName: 'Laptop ABC',
    quantity: 2,
    price: 799.99,
    salesRep: 'Jane Smith',
    category: 'Electronics',
  },
  {
    id: 'TRX-004',
    date: '2024-04-10',
    clientName: 'Charlie Green',
    productName: 'Bluetooth Speaker',
    quantity: 7,
    price: 49.99,
    salesRep: 'Mark Lee',
    category: 'Accessories',
  },
  {
    id: 'TRX-005',
    date: '2024-05-05',
    clientName: 'Diana White',
    productName: 'Smartphone 123',
    quantity: 3,
    price: 599.99,
    salesRep: 'Emily Davis',
    category: 'Electronics',
  },
  {
    id: 'TRX-006',
    date: '2024-05-15',
    clientName: 'Evan King',
    productName: 'Tablet Pro',
    quantity: 4,
    price: 399.99,
    salesRep: 'Jane Smith',
    category: 'Electronics',
  },
  {
    id: 'TRX-007',
    date: '2024-06-01',
    clientName: 'Fiona Hill',
    productName: 'Gaming Keyboard',
    quantity: 6,
    price: 89.99,
    salesRep: 'Mark Lee',
    category: 'Accessories',
  },
  {
    id: 'TRX-008',
    date: '2024-06-20',
    clientName: 'George Miller',
    productName: 'Smartwatch',
    quantity: 2,
    price: 199.99,
    salesRep: 'Emily Davis',
    category: 'Wearables',
  },
  {
    id: 'TRX-009',
    date: '2024-07-10',
    clientName: 'Hannah Scott',
    productName: 'Headphones',
    quantity: 8,
    price: 59.99,
    salesRep: 'Jane Smith',
    category: 'Accessories',
  },
  {
    id: 'TRX-010',
    date: '2024-07-15',
    clientName: 'Ian Baker',
    productName: 'Desktop Monitor',
    quantity: 1,
    price: 299.99,
    salesRep: 'Mark Lee',
    category: 'Electronics',
  },
  {
    id: 'TRX-011',
    date: '2024-08-01',
    clientName: 'Jessica Adams',
    productName: 'Wireless Charger',
    quantity: 5,
    price: 29.99,
    salesRep: 'Emily Davis',
    category: 'Accessories',
  },
  {
    id: 'TRX-012',
    date: '2024-08-20',
    clientName: 'Kevin Turner',
    productName: 'USB-C Hub',
    quantity: 3,
    price: 24.99,
    salesRep: 'Jane Smith',
    category: 'Accessories',
  },
])

// Filters
const startDate = ref('')
const endDate = ref('')
const selectedSalesRep = ref('')
const selectedCategory = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref('date')
const sortDirection = ref('desc')

// Computed Properties for Unique Values
const salesReps = computed(() => {
  return [...new Set(salesData.value.map((item) => item.salesRep))]
})

const categories = computed(() => {
  return [...new Set(salesData.value.map((item) => item.category))]
})

// Filtered Data
const filteredData = computed(() => {
  let filtered = [...salesData.value]

  // Date range filter
  if (startDate.value && endDate.value) {
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= new Date(startDate.value) && itemDate <= new Date(endDate.value)
    })
  }

  // Sales rep filter
  if (selectedSalesRep.value) {
    filtered = filtered.filter((item) => item.salesRep === selectedSalesRep.value)
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter((item) => item.category === selectedCategory.value)
  }

  // Search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.id.toLowerCase().includes(query) || item.clientName.toLowerCase().includes(query),
    )
  }

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0
    if (a[sortBy.value] < b[sortBy.value]) comparison = -1
    if (a[sortBy.value] > b[sortBy.value]) comparison = 1
    return sortDirection.value === 'desc' ? -comparison : comparison
  })

  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      (i >= currentPage.value - 1 && i <= currentPage.value + 1)
    ) {
      pages.push(i)
    } else if (i === currentPage.value - 2 || i === currentPage.value + 2) {
      pages.push('...')
    }
  }
  return pages
})

// Key Metrics
const totalSales = computed(() => {
  return filteredData.value.reduce((sum, item) => sum + item.quantity * item.price, 0)
})

const totalTransactions = computed(() => filteredData.value.length)

const topSellingProduct = computed(() => {
  const productSales = {}
  filteredData.value.forEach((item) => {
    productSales[item.productName] = (productSales[item.productName] || 0) + item.quantity
  })
  const topProduct = Object.entries(productSales).sort(([, a], [, b]) => b - a)[0]
  return {
    name: topProduct[0],
    quantity: topProduct[1],
  }
})

// Methods
const handleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(filteredData.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Report')
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(data, 'sales-report.xlsx')
}

const exportToCSV = () => {
  const ws = XLSX.utils.json_to_sheet(filteredData.value)
  const csv = XLSX.utils.sheet_to_csv(ws)
  const data = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  saveAs(data, 'sales-report.csv')
}

// Watch for filter changes to reset pagination
watch([startDate, endDate, selectedSalesRep, selectedCategory, searchQuery], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="sales-overview">
    <!-- Filters Section -->
    <section class="filters-section">
      <div class="date-filters">
        <div class="filter-group">
          <label for="start-date">Start Date:</label>
          <input type="date" id="start-date" class="date-input" v-model="startDate" />
        </div>
        <div class="filter-group">
          <label for="end-date">End Date:</label>
          <input type="date" id="end-date" class="date-input" v-model="endDate" />
        </div>
      </div>

      <div class="additional-filters">
        <div class="filter-group">
          <label for="sales-rep">Sales Representative:</label>
          <select id="sales-rep" class="filter-select" v-model="selectedSalesRep">
            <option value="">All Representatives</option>
            <option v-for="rep in salesReps" :key="rep" :value="rep">
              {{ rep }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label for="category">Product Category:</label>
          <select id="category" class="filter-select" v-model="selectedCategory">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label for="search">Search:</label>
          <input
            type="text"
            id="search"
            class="search-input"
            v-model="searchQuery"
            placeholder="Search by Transaction ID or Client Name"
          />
        </div>
      </div>
    </section>

    <!-- Key Metrics Section -->
    <section class="metrics-section">
      <div class="metric-card">
        <h3>Total Sales</h3>
        <p class="metric-value">
          ${{ totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </p>
      </div>
      <div class="metric-card">
        <h3>Number of Transactions</h3>
        <p class="metric-value">{{ totalTransactions.toLocaleString() }}</p>
      </div>
      <div class="metric-card">
        <h3>Top-Selling Product</h3>
        <p class="metric-value">{{ topSellingProduct.name }}</p>
        <p class="metric-subtext">Qty: {{ topSellingProduct.quantity }} units</p>
      </div>
      <div class="metric-card">
        <h3>Total Revenue</h3>
        <p class="metric-value">
          ${{ totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </p>
      </div>
    </section>

    <!-- Export and Print Buttons -->
    <section class="action-buttons">
      <button class="action-btn export-btn" @click="exportToExcel">Export to Excel</button>
      <button class="action-btn export-btn" @click="exportToCSV">Export to CSV</button>
    </section>

    <!-- Sales Report Table -->
    <section class="table-section">
      <table class="sales-table">
        <thead>
          <tr>
            <th
              v-for="column in [
                'date',
                'id',
                'clientName',
                'productName',
                'quantity',
                'price',
                'total',
                'salesRep',
              ]"
              :key="column"
              class="sortable"
              @click="handleSort(column)"
            >
              {{ column.charAt(0).toUpperCase() + column.slice(1) }}
              {{ sortBy === column ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td>{{ new Date(item.date).toLocaleDateString() }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.clientName }}</td>
            <td>{{ item.productName }}</td>
            <td>{{ item.quantity }}</td>
            <td>${{ item.price.toFixed(2) }}</td>
            <td>${{ (item.quantity * item.price).toFixed(2) }}</td>
            <td>{{ item.salesRep }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          Previous
        </button>
        <button
          v-for="page in pageNumbers"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="typeof page === 'number' && changePage(page)"
          :disabled="typeof page !== 'number'"
        >
          {{ page }}
        </button>
        <button
          class="page-btn"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sales-overview {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Filters Section */
.filters-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.date-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.additional-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
}

.date-input,
.filter-select,
.search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

/* Metrics Section */
.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.metric-card h3 {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.metric-subtext {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.export-btn {
  background-color: #4caf50;
  color: white;
}

.print-btn {
  background-color: #2196f3;
  color: white;
}

.action-btn:hover {
  opacity: 0.9;
}

/* Table Section */
.table-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.sales-table th,
.sales-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.sales-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.sortable {
  cursor: pointer;
}

.sortable:hover {
  background-color: #eee;
}

.sales-table tbody tr:hover {
  background-color: #f5f5f5;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn.active {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}

.page-btn:hover:not(.active) {
  background-color: #f5f5f5;
}

.page-ellipsis {
  padding: 0.5rem;
  color: #666;
}

/* Additional print styles */
@media print {
  .filters-section,
  .action-buttons,
  .pagination {
    display: none;
  }

  .sales-overview {
    padding: 0;
  }

  .table-section {
    box-shadow: none;
  }

  .sales-table th,
  .sales-table td {
    padding: 0.5rem;
    font-size: 12px;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .sales-overview {
    padding: 1rem;
  }

  .date-filters {
    flex-direction: column;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
  }
}
</style>
