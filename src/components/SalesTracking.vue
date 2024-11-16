<template>
  <div class="sales-tracking">
    <!-- Order Tracking Section -->
    <section class="order-tracking">
      <h2>Order Tracking</h2>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-item">
          <label for="date">Date:</label>
          <input type="date" id="date" v-model="filters.date">
        </div>
        <div class="filter-item">
          <label for="customer">Customer:</label>
          <input type="text" id="customer" v-model="filters.customer">
        </div>
        <div class="filter-item">
          <label for="product">Product:</label>
          <input type="text" id="product" v-model="filters.product">
        </div>
        <div class="filter-item">
          <label for="status">Status:</label>
          <select id="status" v-model="filters.status">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Product Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ order.productName }}</td>
              <td>
                <span :class="[ 'status', order.status ]">{{ order.status }}</span>
              </td>
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
          <button class="page-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
            Next
          </button>
        </div>
      </div>
    </section>

    <!-- Product Sales Data Section -->
    <section class="product-sales">
      <h2>Product Sales Data</h2>

      <div class="sales-tables">
        <!-- Top Selling Products -->
        <div class="sales-table">
          <h3>Top 5 Selling Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in topSellingProducts" :key="product.id">
                <td>{{ product.name }}</td>
                <td>{{ product.quantity }}</td>
                <td>${{ product.revenue.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Low Performing Products -->
        <div class="sales-table">
          <h3>Top 5 Low-Performing Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in lowPerformingProducts" :key="product.id">
                <td>{{ product.name }}</td>
                <td>{{ product.quantity }}</td>
                <td>${{ product.revenue.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Invoicing Section -->
    <section class="invoicing">
      <h2>Invoicing</h2>

      <button class="generate-invoice">Generate Invoice</button>

      <div class="table-container">
        <h3>Overdue Payments</h3>
        <table class="overdue-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Overdue Days</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in paginatedOverduePayments" :key="payment.id">
              <td>{{ payment.orderId }}</td>
              <td>${{ payment.amount.toFixed(2) }}</td>
              <td>{{ payment.overdueDays }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination for Overdue Payments -->
        <div class="pagination">
          <button @click="prevOverduePage" :disabled="currentOverduePage === 1">&lt; Previous</button>
          <span>Page {{ currentOverduePage }} of {{ totalOverduePages }}</span>
          <button @click="nextOverduePage" :disabled="currentOverduePage === totalOverduePages">Next &gt;</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Imported pagination logic and additional methods from ReportsOverview.vue
import { ref, computed } from 'vue'

// Filters state
const filters = ref({
  date: '',
  customer: '',
  product: '',
  status: ''
})

// Mock data for orders (added more for pagination testing)
const orders = ref([
  { id: 1, customerName: 'John Doe', productName: 'Laptop', status: 'pending' },
  { id: 2, customerName: 'Jane Smith', productName: 'Mouse', status: 'completed' },
  { id: 3, customerName: 'Alice Johnson', productName: 'Keyboard', status: 'cancelled' },
  { id: 4, customerName: 'Bob Brown', productName: 'Monitor', status: 'completed' },
  { id: 5, customerName: 'Tom White', productName: 'Desk', status: 'pending' },
  { id: 6, customerName: 'Emily Davis', productName: 'Chair', status: 'completed' },
  { id: 7, customerName: 'George Clark', productName: 'Table', status: 'cancelled' },
  { id: 8, customerName: 'Hannah Lee', productName: 'Mousepad', status: 'pending' },
  { id: 9, customerName: 'Jack Wilson', productName: 'Monitor Stand', status: 'completed' },
  { id: 10, customerName: 'Sarah Brown', productName: 'Headphones', status: 'completed' },
  { id: 11, customerName: 'Michael Green', productName: 'Webcam', status: 'pending' },
  { id: 12, customerName: 'Chloe Adams', productName: 'Keyboard', status: 'completed' },
  { id: 13, customerName: 'Matthew White', productName: 'Microphone', status: 'pending' },
  { id: 14, customerName: 'Sophia King', productName: 'Laptop', status: 'cancelled' },
  { id: 15, customerName: 'Oliver Scott', productName: 'Desk', status: 'completed' }
  // Add more data as needed
])

// Mock data for top-selling products
const topSellingProducts = ref([
  { id: 1, name: 'Laptop', quantity: 50, revenue: 50000 },
  { id: 2, name: 'Mouse', quantity: 100, revenue: 5000 },
  { id: 3, name: 'Keyboard', quantity: 80, revenue: 8000 },
  { id: 4, name: 'Monitor', quantity: 40, revenue: 20000 },
  { id: 5, name: 'Desk', quantity: 20, revenue: 10000 }
])

// Mock data for low-performing products
const lowPerformingProducts = ref([
  { id: 1, name: 'Chairs', quantity: 5, revenue: 500 },
  { id: 2, name: 'Cable', quantity: 10, revenue: 200 },
  { id: 3, name: 'Notebook', quantity: 15, revenue: 300 },
  { id: 4, name: 'Stapler', quantity: 8, revenue: 160 },
  { id: 5, name: 'Pen', quantity: 12, revenue: 120 }
])

// Mock data for overdue payments (added more for pagination testing)
const overduePayments = ref([
  { id: 1, orderId: 101, amount: 150.5, overdueDays: 5 },
  { id: 2, orderId: 102, amount: 300.0, overdueDays: 10 },
  { id: 3, orderId: 103, amount: 75.25, overdueDays: 3 },
  { id: 4, orderId: 104, amount: 450.75, overdueDays: 7 },
  { id: 5, orderId: 105, amount: 125.0, overdueDays: 2 },
  { id: 6, orderId: 106, amount: 215.5, overdueDays: 8 },
  { id: 7, orderId: 107, amount: 325.75, overdueDays: 6 },
  { id: 8, orderId: 108, amount: 400.0, overdueDays: 12 },
  { id: 9, orderId: 109, amount: 95.5, overdueDays: 4 },
  { id: 10, orderId: 110, amount: 180.0, overdueDays: 9 },
  { id: 11, orderId: 111, amount: 290.25, overdueDays: 11 },
  { id: 12, orderId: 112, amount: 75.0, overdueDays: 3 },
  { id: 13, orderId: 113, amount: 130.5, overdueDays: 2 },
  { id: 14, orderId: 114, amount: 210.0, overdueDays: 7 },
  { id: 15, orderId: 115, amount: 325.0, overdueDays: 10 }
])

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));

const pageNumbers = computed(() => {
  const pages = [];
  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    let start = Math.max(2, currentPage.value - 1);
    let end = Math.min(totalPages.value - 1, currentPage.value + 1);

    if (currentPage.value === totalPages.value - 1) {
      start = totalPages.value - 3;
    } else if (currentPage.value === 2) {
      end = 4;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    pages.push(totalPages.value);
  }

  return pages;
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return orders.value.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Overdue payments pagination
const currentOverduePage = ref(1)
const totalOverduePages = computed(() => Math.ceil(overduePayments.value.length / itemsPerPage))
const paginatedOverduePayments = computed(() => {
  const start = (currentOverduePage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return overduePayments.value.slice(start, end)
})

const nextOverduePage = () => {
  if (currentOverduePage.value < totalOverduePages.value) currentOverduePage.value++
}
const prevOverduePage = () => {
  if (currentOverduePage.value > 1) currentOverduePage.value--
}
</script>



<style>
.sales-tracking {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  margin-bottom: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

h3 {
  color: #555;
  margin-bottom: 15px;
  font-size: 18px;
}

/* Filters */
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  margin-bottom: 5px;
  color: #666;
}

.filter-item input,
.filter-item select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* Tables */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}

/* Status styles */
.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: capitalize;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status.completed {
  background-color: #d4edda;
  color: #155724;
}

.status.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

/* Product Sales Tables */
.sales-tables {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.sales-table {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
}

/* Generate Invoice Button */
.generate-invoice {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.generate-invoice:hover {
  background-color: #0056b3;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #f0f0f0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .sales-tables {
    grid-template-columns: 1fr;
  }

  .table-container {
    margin: 0 -20px;
    padding: 0 20px;
  }
}
</style>
