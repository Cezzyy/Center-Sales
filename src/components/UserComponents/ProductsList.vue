<script setup>
import { defineAsyncComponent } from 'vue'
import { useProductsStore } from '@/stores/productStore'
const AddProductModal = defineAsyncComponent(() => import('../UserSideModals/AddProductModal.vue'))
const EditProductModal = defineAsyncComponent(() => import('../UserSideModals/EditProductModal.vue'))

const store = useProductsStore()

const openEditProductModal = (product) => {
  store.showEditProductModal = true
  store.editProduct = { ...product }
}

const handleAddProduct = () => {
  // Add product logic here
}

const handleEditProduct = () => {
  // Edit product logic here
}
</script>

<template>
  <div class="products-list-container">
    <!-- Filters Section -->
    <section class="filters-section">
      <div class="search-bar">
        <input
          type="text"
          v-model="store.searchQuery"
          placeholder="Search by name, SKU, or category..."
          class="search-input"
        />
      </div>
      <div class="category-filter">
        <select v-model="store.selectedCategory" class="category-select">
          <option value="">All Categories</option>
          <option v-for="category in store.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </section>

    <!-- Key Metrics Section -->
    <section class="metrics-section">
      <div class="metric-card">
        <h3>Total Products</h3>
        <p class="metric-value">{{ store.totalProducts }}</p>
      </div>
      <div class="metric-card">
        <h3>In-Stock Products</h3>
        <p class="metric-value">{{ store.inStockProducts }}</p>
      </div>
      <div class="metric-card">
        <h3>Out-of-Stock Products</h3>
        <p class="metric-value">{{ store.outOfStockProducts }}</p>
      </div>
    </section>

    <!-- Actions Section -->
    <section class="actions-section">
      <button @click="store.showAddProductModal = true" class="action-button add-button">
        Add Product
      </button>
      <button @click="store.exportToExcel" class="action-button export-button">Export to Excel</button>
    </section>

    <AddProductModal v-model="store.showAddProductModal" @submit="handleAddProduct" />

    <!-- Products Table -->
    <section class="table-section">
      <table class="products-table">
        <thead>
          <tr>
            <th
              v-for="column in ['name', 'sku', 'category', 'quantity', 'price', 'status']"
              :key="column"
              @click="store.handleSort(column)"
              class="sortable"
            >
              {{ column.charAt(0).toUpperCase() + column.slice(1) }}
              {{ store.sortColumn === column ? (store.sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in store.paginatedProducts" :key="product.id">
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
              <button @click="openEditProductModal(product)" class="icon-button edit">Edit</button>
              <button @click="store.deleteProduct(product.id)" class="icon-button delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <EditProductModal
        v-model="store.showEditProductModal"
        :product="store.editProduct"
        @submit="handleEditProduct"
      />
      <!-- Pagination -->
      <div class="pagination-section">
        <button
          @click="store.handlePageChange(store.currentPage - 1)"
          :disabled="store.currentPage === 1"
          class="pagination-button"
        >
          Previous
        </button>
        <div class="page-numbers">
          <button
            v-for="(page, index) in store.pageNumbers"
            :key="index"
            @click="typeof page === 'number' && store.handlePageChange(page)"
            :class="['page-number', { active: page === store.currentPage }]"
            :disabled="typeof page !== 'number'"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="store.handlePageChange(store.currentPage + 1)"
          :disabled="store.currentPage === store.totalPages"
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
