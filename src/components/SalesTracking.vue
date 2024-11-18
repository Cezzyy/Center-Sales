<script setup>
import { ref, computed } from 'vue';
import AddSalesModal from './AddSalesModal.vue'
import AddInvoiceModal from './AddInvoiceModal.vue';
import ViewOrderModal from './ViewOrderModal.vue';

// State for modal visibility
const isAddSalesModalOpen = ref(false);
const isAddInvoiceModalOpen = ref(false);
const isViewOrderModalOpen = ref(false);

const viewOrder = ref({
  orderId: '',
  customerName: '',
  productName: '',
  quantity: 0,
  salesRepresentative: '',
  amount: 0,
  status: '',
});

// Open and close modal functions
const openAddSalesModal = () => {
  isAddSalesModalOpen.value = true;
};

const closeAddSalesModal = () => {
  isAddSalesModalOpen.value = false;
};

const openAddInvoiceModal = () => {
  isAddInvoiceModalOpen.value = true;
};

const closeAddInvoiceModal = () => {
  isAddInvoiceModalOpen.value = false;
};

const openViewOrderModal = (order) => {
  isViewOrderModalOpen.value = true;
  viewOrder.value = order;
};

const closeViewOrderModal = () => {
  isViewOrderModalOpen.value = false;
};

// Handle form submission from modal
const handleAddSalesSubmit = (salesData) => {
  console.log('Sales Data Submitted:', salesData);
  // Add logic to handle the submitted sales data
  closeAddSalesModal();
};

const handleAddInvoiceSubmit = (invoiceData) => {
  console.log('Invoice Data Submitted:', invoiceData);
  closeAddInvoiceModal();
};

// Sample data for Orders
const orders = ref([
  { orderId: "ORD-001", customerName: "John Doe", productName: "Product A", amount: 1500, status: "pending", quantity: 10, salesRepresentative: "Neil Vallecer", date: "2024-01-01" },
  { orderId: "ORD-002", customerName: "Jane Smith", productName: "Product B", amount: 1200, status: "completed", quantity: 5, salesRepresentative: "Neil Vallecer", date: "2024-01-02" },
  // Add more orders...
]);

// Sample data for Invoices
const invoices = ref([
  { invoiceId: "INV-001", customer: "John Doe", amount: 1500, dueDate: "2024-02-01", daysOverdue: 15 },
  { invoiceId: "INV-002", customer: "Jane Smith", amount: 1200, dueDate: "2024-02-10", daysOverdue: 0 },
  // Add more sample invoices...
]);

// Pagination state
const currentPageOrders = ref(1);
const currentPageInvoices = ref(1);
const itemsPerPage = 10;

// Filter state for Orders
const orderFilters = ref({
  dateFrom: "",
  dateTo: "",
  orderId: "",
  customerName: "",
  productName: "",
  status: "",
});

// Computed: Filtered Orders
const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesOrderId =
      !orderFilters.value.orderId || order.orderId.toLowerCase().includes(orderFilters.value.orderId.toLowerCase());

    const matchesCustomer =
      !orderFilters.value.customerName || order.customerName.toLowerCase().includes(orderFilters.value.customerName.toLowerCase());

    const matchesProduct =
      !orderFilters.value.productName || order.productName.toLowerCase().includes(orderFilters.value.productName.toLowerCase());

    const matchesStatus = !orderFilters.value.status || order.status === orderFilters.value.status;

    const matchesDateRange =
      (!orderFilters.value.dateFrom || !orderFilters.value.dateTo) ||
      (order.date >= orderFilters.value.dateFrom && order.date <= orderFilters.value.dateTo);

    return matchesOrderId && matchesCustomer && matchesProduct && matchesStatus && matchesDateRange;
  });
});

// Computed: Paginated Orders
const paginatedOrders = computed(() => {
  const startIndex = (currentPageOrders.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredOrders.value.slice(startIndex, endIndex);
});

// Computed: Total pages for Orders
const totalOrderPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage));

// Filter state for Invoices
const invoiceFilters = ref({
  invoiceId: "",
  customer: "",
});

// Computed: Filtered Invoices
const filteredInvoices = computed(() => {
  return invoices.value.filter((invoice) => {
    const matchesInvoiceId =
      !invoiceFilters.value.invoiceId || invoice.invoiceId.toLowerCase().includes(invoiceFilters.value.invoiceId.toLowerCase());

    const matchesCustomer =
      !invoiceFilters.value.customer || invoice.customer.toLowerCase().includes(invoiceFilters.value.customer.toLowerCase());

    return matchesInvoiceId && matchesCustomer;
  });
});

// Computed: Paginated Invoices
const paginatedInvoices = computed(() => {
  const startIndex = (currentPageInvoices.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredInvoices.value.slice(startIndex, endIndex);
});

// Computed: Total pages for Invoices
const totalInvoicePages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage));

// Pagination methods for Orders
const goToPageOrders = (page) => {
  if (page >= 1 && page <= totalOrderPages.value) {
    currentPageOrders.value = page;
  }
};

const goToPreviousPageOrders = () => {
  if (currentPageOrders.value > 1) {
    currentPageOrders.value--;
  }
};

const goToNextPageOrders = () => {
  if (currentPageOrders.value < totalOrderPages.value) {
    currentPageOrders.value++;
  }
};

// Pagination methods for Invoices
const goToPageInvoices = (page) => {
  if (page >= 1 && page <= totalInvoicePages.value) {
    currentPageInvoices.value = page;
  }
};

const goToPreviousPageInvoices = () => {
  if (currentPageInvoices.value > 1) {
    currentPageInvoices.value--;
  }
};

const goToNextPageInvoices = () => {
  if (currentPageInvoices.value < totalInvoicePages.value) {
    currentPageInvoices.value++;
  }
};

// Reset Filters for Orders
const resetOrderFilters = () => {
  orderFilters.value = {
    dateFrom: "",
    dateTo: "",
    orderId: "",
    customerName: "",
    productName: "",
    status: "",
  };
};

// Reset Filters for Invoices
const resetInvoiceFilters = () => {
  invoiceFilters.value = {
    invoiceId: "",
    customer: "",
  };
};
</script>

<template>
  <div class="sales-tracking">
    <!-- Order Tracking Section -->
    <section class="section order-tracking">
      <div class="section-header">
        <h2>Order Tracking</h2>
        <button class="btn-add" @click="openAddSalesModal">+ Add Sales Order</button>
        <AddSalesModal
      v-model="isAddSalesModalOpen"
      :productPrice="50"
      @submit="handleAddSalesSubmit"
      />
      </div>


      <!-- Filter Section for Orders -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Date Range</label>
          <input type="date" class="filter-input" v-model="orderFilters.dateFrom" placeholder="From" />
          <input type="date" class="filter-input" v-model="orderFilters.dateTo" placeholder="To" />
        </div>
        <div class="filter-group">
          <label>Order ID</label>
          <input type="text" class="filter-input" v-model="orderFilters.orderId" placeholder="Search Order ID..." />
        </div>
        <div class="filter-group">
          <label>Customer Name</label>
          <input type="text" class="filter-input" v-model="orderFilters.customerName" placeholder="Search Customer..." />
        </div>
        <div class="filter-group">
          <label>Product Name</label>
          <input type="text" class="filter-input" v-model="orderFilters.productName" placeholder="Search Product..." />
        </div>
        <div class="filter-group">
          <label>Status</label>
          <select class="filter-input" v-model="orderFilters.status">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button class="btn-reset" @click="resetOrderFilters">Reset Filters</button>
      </div>

      <!-- Orders Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Product Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.orderId">
              <td>{{ order.orderId }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ order.productName }}</td>
              <td>${{ order.amount.toFixed(2) }}</td>
              <td><span :class="'status-badge ' + order.status">{{ order.status }}</span></td>
              <td class="action-buttons">
                <button class="btn-action btn-edit">✎ Edit</button>
                <button class="btn-action btn-view" @click="openViewOrderModal(order)">👁 View</button>
              </td>
            </tr>
            <tr v-if="paginatedOrders.length === 0">
              <td colspan="6">No orders found.</td>
            </tr>
          </tbody>
        </table>
        <ViewOrderModal
      v-model="isViewOrderModalOpen"
      :order="viewOrder"
      @update:modelValue="closeViewOrderModal"
      />

        <!-- Pagination for Orders -->
        <div class="pagination">
          <button class="btn-page" @click="goToPreviousPageOrders" :disabled="currentPageOrders === 1">Previous</button>
          <button
            class="btn-page"
            v-for="page in totalOrderPages"
            :key="page"
            :class="{ active: currentPageOrders === page }"
            @click="goToPageOrders(page)"
          >
            {{ page }}
          </button>
          <button class="btn-page" @click="goToNextPageOrders" :disabled="currentPageOrders === totalOrderPages">Next</button>
        </div>
      </div>
    </section>

    <!-- Invoicing Section -->
    <section class="section invoicing">
      <div class="section-header">
        <h2>Invoicing</h2>
        <button class="btn-add" @click="openAddInvoiceModal">+ Add Invoice</button>
        <AddInvoiceModal
      v-model="isAddInvoiceModalOpen"
      :orders="orders"
      @submit="handleAddInvoiceSubmit"
      />
      </div>

      <!-- Filter Section for Invoices -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Invoice ID</label>
          <input
            type="text"
            class="filter-input"
            v-model="invoiceFilters.invoiceId"
            placeholder="Search Invoice ID..."
          />
        </div>
        <div class="filter-group">
          <label>Customer Name</label>
          <input
            type="text"
            class="filter-input"
            v-model="invoiceFilters.customer"
            placeholder="Search Customer..."
          />
        </div>
        <button class="btn-reset" @click="resetInvoiceFilters">Reset Filters</button>
      </div>

      <!-- Overdue Payments Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Days Overdue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in paginatedInvoices" :key="invoice.invoiceId">
              <td>{{ invoice.invoiceId }}</td>
              <td>{{ invoice.customer }}</td>
              <td>${{ invoice.amount.toFixed(2) }}</td>
              <td>{{ invoice.dueDate }}</td>
              <td :class="{ overdue: invoice.daysOverdue > 0 }">
                {{ invoice.daysOverdue > 0 ? invoice.daysOverdue + ' days' : 'On Time' }}
              </td>
              <td class="action-buttons">
                <button class="btn-action btn-edit">✎ Edit</button>
                <button class="btn-action btn-paid">✓ Paid</button>
              </td>
            </tr>
            <tr v-if="paginatedInvoices.length === 0">
              <td colspan="6">No invoices found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination for Invoices -->
        <div class="pagination">
          <button
            class="btn-page"
            @click="goToPreviousPageInvoices"
            :disabled="currentPageInvoices === 1"
          >
            Previous
          </button>
          <button
            class="btn-page"
            v-for="page in totalInvoicePages"
            :key="page"
            :class="{ active: currentPageInvoices === page }"
            @click="goToPageInvoices(page)"
          >
            {{ page }}
          </button>
          <button
            class="btn-page"
            @click="goToNextPageInvoices"
            :disabled="currentPageInvoices === totalInvoicePages"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Base Styles */
.sales-tracking {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
}

/* Section Styles */
.section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* Button Styles */
.btn-add {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background: #2980b9;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-action .btn-icon {
  font-size: 1rem;
}

.btn-action .btn-text {
  display: inline-block;
}

/* Edit Button */
.btn-edit {
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #dee2e6;
}

.btn-edit:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

/* View Button */
.btn-view {
  background-color: #e3f2fd;
  color: #0d47a1;
  border: 1px solid #bbdefb;
}

.btn-view:hover {
  background-color: #bbdefb;
  border-color: #90caf9;
}

/* Paid Button */
.btn-paid {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.btn-paid:hover {
  background-color: #c8e6c9;
  border-color: #a5d6a7;
}

/* Filter Section */
.filter-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #666;
}

.filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.filter-input:focus {
  outline: none;
  border-color: #3498db;
}

/* Reset Button */
.btn-reset {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #555;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-reset:hover {
  background-color: #e0e0e0;
  color: #333;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.data-table tr:hover {
  background: #f8f9fa;
}

/* Status Badge */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.overdue {
  color: #dc3545;
  font-weight: 500;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-page:hover {
  background: #f8f9fa;
}

.btn-page.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sales-tracking {
    padding: 1rem;
  }

  .filter-section {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-add {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }
}
</style>
