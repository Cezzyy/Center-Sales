<script setup>
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import * as XLSX from 'xlsx'
import AddProductModal from './AddProductModal.vue'
import EditProductModal from './EditProductModal.vue'

const showAddProductModal = ref(false)
const showEditProductModal = ref(false)

// Initial sample data
const initialProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    quantity: 45,
    price: 99.99,
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Smart Watch',
    sku: 'SW-002',
    category: 'Electronics',
    quantity: 0,
    price: 199.99,
    status: 'Out of Stock',
  },
]

// Reactive state
const products = useStorage('products', initialProducts)
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortColumn = ref('name')
const sortDirection = ref('asc')

// Categories list
const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map((product) => product.category))
  return Array.from(uniqueCategories)
})

// Computed metrics
const totalProducts = computed(() => products.value.length)
const inStockProducts = computed(() => products.value.filter((p) => p.quantity > 0).length)
const outOfStockProducts = computed(() => products.value.filter((p) => p.quantity === 0).length)

// Filtered and sorted products
const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter((product) => product.category === selectedCategory.value)
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aValue = a[sortColumn.value]
    const bValue = b[sortColumn.value]

    if (typeof aValue === 'string') {
      return sortDirection.value === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
  })

  return filtered
})

// Paginated products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

// Page numbers array for pagination
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

// Methods
const handleSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const deleteProduct = (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    products.value = products.value.filter((p) => p.id !== productId)
  }
}

const exportToExcel = () => {
  const data = filteredProducts.value.map((product) => ({
    'Product Name': product.name,
    SKU: product.sku,
    Category: product.category,
    'Stock Quantity': product.quantity,
    Price: product.price,
    Status: product.status,
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

  // Generate file name with current date
  const date = new Date().toISOString().split('T')[0]
  const fileName = `products-${date}.xlsx`

  XLSX.writeFile(workbook, fileName)
}
</script>

<template>
  <div class="products-list-container">
    <!-- Filters Section -->
    <section class="filters-section">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, SKU, or category..."
          class="search-input"
        />
      </div>
      <div class="category-filter">
        <select v-model="selectedCategory" class="category-select">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </section>

    <!-- Key Metrics Section -->
    <section class="metrics-section">
      <div class="metric-card">
        <h3>Total Products</h3>
        <p class="metric-value">{{ totalProducts }}</p>
      </div>
      <div class="metric-card">
        <h3>In-Stock Products</h3>
        <p class="metric-value">{{ inStockProducts }}</p>
      </div>
      <div class="metric-card">
        <h3>Out-of-Stock Products</h3>
        <p class="metric-value">{{ outOfStockProducts }}</p>
      </div>
    </section>

    <!-- Actions Section -->
    <section class="actions-section">
      <button @click="showAddProductModal = true" class="action-button add-button">
        Add Product
      </button>
      <button @click="exportToExcel" class="action-button export-button">Export to Excel</button>
    </section>

    <AddProductModal v-model="showAddProductModal" @submit="handleAddProduct" />

    <!-- Products Table -->
    <section class="table-section">
      <table class="products-table">
        <thead>
          <tr>
            <th
              v-for="column in ['name', 'sku', 'category', 'quantity', 'price', 'status']"
              :key="column"
              @click="handleSort(column)"
              class="sortable"
            >
              {{ column.charAt(0).toUpperCase() + column.slice(1) }}
              {{ sortColumn === column ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.sku }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.quantity }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>
              <span :class="['status', product.quantity > 0 ? 'in-stock' : 'out-of-stock']">
                {{ product.quantity > 0 ? 'In Stock' : 'Out of Stock' }}
              </span>
            </td>
            <td class="actions">
              <button @click="showEditProductModal = true" class="icon-button edit">Edit</button>
              <button @click="deleteProduct(product.id)" class="icon-button delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <EditProductModal v-model="showEditProductModal" :product="selectedProduct" @submit="handleEditProduct" />
      <!-- Pagination -->
      <div class="pagination-section">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          Previous
        </button>
        <div class="page-numbers">
          <button
            v-for="(page, index) in pageNumbers"
            :key="index"
            @click="typeof page === 'number' && handlePageChange(page)"
            :class="['page-number', { active: page === currentPage }]"
            :disabled="typeof page !== 'number'"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.products-list-container {
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.search-bar,
.category-filter {
  width: 50%; /* Each element occupies 50% of the container */
}

.search-input,
.category-select {
  width: 100%; /* Ensure full width within their containers */
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.search-input {
  flex: 1;
}

/* Metrics Section */
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

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #212529;
  margin: 0;
}

/* Actions Section */
.actions-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: white;
}

.export-button {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: white;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin-bottom: 2rem;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.products-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.sortable {
  cursor: pointer;
}

.sortable:hover {
  background-color: #e9ecef;
}

.status {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  white-space: nowrap;
  text-align: center;
}

.out-of-stock {
  background-color: #f8d7da;
  color: #721c24;
}

.in-stock {
  background-color: #d4edda;
  color: #155724;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.edit {
  background-color: #6c757d;
  color: white;
}

.delete {
  background-color: #dc3545;
  color: white;
}

/* Pagination Section */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-number {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-number.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }

  .actions-section {
    flex-direction: column;
  }

  .metric-card {
    padding: 1rem;
  }

  .products-table {
    font-size: 0.875rem;
  }

  .status {
    font-size: 0.8rem;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-bar,
  .category-filter {
    width: 100%;
  }
}
</style>
