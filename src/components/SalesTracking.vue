<template>
  <div class="sales-dashboard">
    <!-- Order Tracking Section -->
    <section class="dashboard-section order-tracking">
      <h2>Order Tracking</h2>
      <div class="filters">
        <input type="date" v-model="filters.date" placeholder="Filter by date" />
        <input type="text" v-model="filters.customer" placeholder="Search customer" />
        <input type="text" v-model="filters.product" placeholder="Search product" />
        <select v-model="filters.status">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Returned">Returned</option>
        </select>
      </div>
      <div class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-item">
          <span class="order-id">#{{ order.id }}</span>
          <span class="order-customer">{{ order.customer }}</span>
          <span class="order-product">{{ order.product }}</span>
          <span :class="['order-status', order.status]">{{ order.status }}</span>
        </div>
      </div>
    </section>

    <!-- Product Sales Data Section -->
    <section class="dashboard-section product-sales">
      <h2>Product Sales Data</h2>
      <div class="sales-metrics">
        <div class="metric-card top-products">
          <h3>Top Selling Products</h3>
          <ul>
            <li v-for="product in topProducts" :key="product.id">
              <span class="product-name">{{ product.name }}</span>
              <span class="product-sales">{{ product.quantity }} units</span>
              <span class="product-revenue">₱{{ product.revenue }}</span>
            </li>
          </ul>
        </div>
        <div class="metric-card low-products">
          <h3>Low Performing Products</h3>
          <ul>
            <li v-for="product in lowProducts" :key="product.id">
              <span class="product-name">{{ product.name }}</span>
              <span class="product-sales">{{ product.quantity }} units</span>
              <span class="product-revenue">₱{{ product.revenue }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Invoicing Section -->
    <section class="dashboard-section invoicing">
      <h2>Invoicing</h2>
      <div class="invoice-controls">
        <button @click="generateInvoice" class="btn-generate">Generate Invoice</button>
        <div class="payment-alerts">
          <h3>Overdue Payments</h3>
          <div v-for="invoice in overdueInvoices" :key="invoice.id" class="alert-item">
            <span class="invoice-id">#{{ invoice.id }}</span>
            <span class="invoice-amount">₱{{ invoice.amount }}</span>
            <span class="days-overdue">{{ invoice.daysOverdue }} Days Overdue</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  date: '',
  customer: '',
  product: '',
  status: '',
})

// Mock data
const orders = ref([
  { id: 1, customer: 'Neil Vallecer', product: 'Welding Machine', status: 'Pending' },
])

const topProducts = ref([{ id: 1, name: 'Welding Mask', quantity: 150, revenue: 15000 }])

const lowProducts = ref([{ id: 1, name: 'Electric Rod', quantity: 10, revenue: 1000 }])

const overdueInvoices = ref([{ id: 1, amount: 1500, daysOverdue: 15 }])

// Computed properties
const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const dateMatch = !filters.value.date || order.date === filters.value.date
    const customerMatch =
      !filters.value.customer ||
      order.customer.toLowerCase().includes(filters.value.customer.toLowerCase())
    const productMatch =
      !filters.value.product ||
      order.product.toLowerCase().includes(filters.value.product.toLowerCase())
    const statusMatch = !filters.value.status || order.status === filters.value.status
    return dateMatch && customerMatch && productMatch && statusMatch
  })
})

// Methods
const generateInvoice = () => {
  console.log('Generating invoice...')
}
</script>

<style scoped>
.sales-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

/* Filters */
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters input,
.filters select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-item {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr 0.5fr;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  align-items: center;
}

.order-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.order-status.pending {
  background: #ffd700;
}
.order-status.completed {
  background: #90ee90;
}
.order-status.returned {
  background: #ffcccb;
}

/* Product Sales */
.sales-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.metric-card ul {
  list-style: none;
  padding: 0;
}

.metric-card li {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

/* Invoicing */
.invoice-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-generate,
.btn-reminder {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-generate {
  background: #4caf50;
  color: white;
  width: fit-content;
}

.btn-reminder {
  background: #ff9800;
  color: white;
}

.alert-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  align-items: center;
  padding: 1rem;
  background: #fff3e0;
  border-radius: 4px;
  margin-top: 0.5rem;
}
</style>
