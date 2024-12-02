<script setup>
import { defineAsyncComponent } from 'vue';
import { useOrderInvoiceStore } from '@/stores/salesStore';
import { storeToRefs } from 'pinia';

const AddSalesModal = defineAsyncComponent(() => import('../UserSideModals/AddSalesModal.vue'));
const AddInvoiceModal = defineAsyncComponent(() => import('../UserSideModals/AddInvoiceModal.vue'));
const ViewOrderModal = defineAsyncComponent(() => import('../UserSideModals/ViewOrderModal.vue'));
const EditOrderModal = defineAsyncComponent(() => import('../UserSideModals/EditOrderModal.vue'));
const EditInvoiceModal = defineAsyncComponent(() => import('../UserSideModals/EditInvoiceModal.vue'));

// Initialize store
const store = useOrderInvoiceStore();

// Destructure state and getters with storeToRefs for reactivity
const {
  isAddSalesModalOpen,
  isAddInvoiceModalOpen,
  isViewOrderModalOpen,
  isEditOrderModalOpen,
  isEditInvoiceModalOpen,
  viewOrder,
  editOrder,
  editInvoice,
  orderFilters,
  invoiceFilters,
  currentPageOrders,
  currentPageInvoices,
  paginatedOrders,
  paginatedInvoices,
  totalOrderPages,
  totalInvoicePages,
} = storeToRefs(store);

// Destructure getters with storeToRefs
const {
} = storeToRefs(store);

// Add computed property for formatted dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate days overdue
const calculateDaysOverdue = (dueDate) => {
  if (!dueDate) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part for accurate day calculation
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = today - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0; // Only return positive values
};

// Modal handlers
const openAddSalesModal = () => store.openModal('AddSales');
const closeAddSalesModal = () => store.closeModal('AddSales');
const openAddInvoiceModal = () => store.openModal('AddInvoice');
const closeAddInvoiceModal = () => store.closeModal('AddInvoice');
const openViewOrderModal = (order) => {
  viewOrder.value = order;
  store.openModal('ViewOrder');
};
const closeViewOrderModal = () => store.closeModal('ViewOrder');
const openEditOrderModal = (order) => {
  editOrder.value = { ...order };
  store.openModal('EditOrder');
};
const closeEditOrderModal = () => store.closeModal('EditOrder');
const openEditInvoiceModal = (invoice) => {
  editInvoice.value = { ...invoice };
  store.openModal('EditInvoice');
};
const closeEditInvoiceModal = () => store.closeModal('EditInvoice');

// Form submission handlers
const handleEditOrderSubmit = (updatedOrder) => {
  store.handleEditOrderSubmit(updatedOrder);
};

const handleAddInvoiceSubmit = (updatedInvoice) => {
  store.handleAddInvoiceSubmit(updatedInvoice);
};

const handleAddSalesSubmit = (salesData) => {
  store.handleAddSalesSubmit(salesData);
};

// Pagination handlers
const goToPageOrders = (page) => store.goToPage('orders', page);
const goToPreviousPageOrders = () => store.goToPreviousPage('orders');
const goToNextPageOrders = () => store.goToNextPage('orders');
const goToPageInvoices = (page) => store.goToPage('invoices', page);
const goToPreviousPageInvoices = () => store.goToPreviousPage('invoices');
const goToNextPageInvoices = () => store.goToNextPage('invoices');

// Filter reset handlers
const resetOrderFilters = () => store.resetFilters('orders');
const resetInvoiceFilters = () => store.resetFilters('invoices');

// Mark invoice as paid
const markAsPaid = (invoiceId) => {
  store.markInvoiceAsPaid(invoiceId);
};
</script>

<template>
  <div class="sales-tracking">
    <!-- Order Tracking Section -->
    <section class="section order-tracking">
      <div class="section-header">
        <h2>Order Tracking</h2>
        <button class="btn-add" @click="openAddSalesModal">+ Add Order</button>
      </div>

      <!-- Filters -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Date From:</label>
          <input
            type="date"
            v-model="orderFilters.dateFrom"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Date To:</label>
          <input
            type="date"
            v-model="orderFilters.dateTo"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Order ID:</label>
          <input
            type="text"
            v-model="orderFilters.orderId"
            placeholder="Search by Order ID"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Customer:</label>
          <input
            type="text"
            v-model="orderFilters.customerName"
            placeholder="Search by Customer"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Product:</label>
          <input
            type="text"
            v-model="orderFilters.productName"
            placeholder="Search by Product"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Status:</label>
          <select v-model="orderFilters.status" class="filter-input">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button class="btn-reset" @click="resetOrderFilters">
          Reset Filters
        </button>
      </div>

      <!-- Orders Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="paginatedOrders.length">
              <tr v-for="order in paginatedOrders" :key="order.orderId">
                <td class="order-id">{{ order.orderId }}</td>
                <td class="date-cell">{{ order.date }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.productName }}</td>
                <td>{{ order.quantity }}</td>
                <td class="amount-cell">₱{{ order.amount.toLocaleString() }}</td>
                <td>
                  <span :class="['status-badge', order.status]">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="btn-action btn-view"
                      @click="openViewOrderModal(order)"
                    >
                      View
                    </button>
                    <button
                      class="btn-action btn-edit"
                      @click="openEditOrderModal(order)"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else class="no-data-row">
              <td colspan="8" class="no-data-cell">
                <div class="no-data-content">
                  <i class="fas fa-search"></i>
                  <p>No orders found</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Orders Pagination -->
      <div class="pagination">
        <button
          class="btn-page"
          @click="goToPreviousPageOrders"
          :disabled="currentPageOrders === 1"
        >
          Previous
        </button>
        <button
          v-for="page in totalOrderPages"
          :key="page"
          class="btn-page"
          :class="{ active: currentPageOrders === page }"
          @click="goToPageOrders(page)"
        >
          {{ page }}
        </button>
        <button
          class="btn-page"
          @click="goToNextPageOrders"
          :disabled="currentPageOrders === totalOrderPages"
        >
          Next
        </button>
      </div>
    </section>

    <!-- Invoicing Section -->
    <section class="section invoicing">
      <div class="section-header">
        <h2>Invoicing</h2>
        <button class="btn-add" @click="openAddInvoiceModal">+ Add Invoice</button>
      </div>

      <!-- Invoice Filters -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Invoice ID:</label>
          <input
            type="text"
            v-model="invoiceFilters.invoiceId"
            placeholder="Search by Invoice ID"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Customer:</label>
          <input
            type="text"
            v-model="invoiceFilters.customer"
            placeholder="Search by Customer"
            class="filter-input"
          />
        </div>
        <button class="btn-reset" @click="resetInvoiceFilters">
          Reset Filters
        </button>
      </div>

      <!-- Invoices Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Days Overdue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="paginatedInvoices.length">
              <tr v-for="invoice in paginatedInvoices" 
                  :key="invoice.invoiceId"
                  :class="{ 'paid-row': invoice.isPaid }">
                <td class="order-id">{{ invoice.invoiceId }}</td>
                <td>{{ invoice.customer }}</td>
                <td class="amount-cell">₱{{ invoice.amount.toLocaleString() }}</td>
                <td class="date-cell">{{ formatDate(invoice.dueDate) }}</td>
                <td :class="{ 'overdue': !invoice.isPaid && calculateDaysOverdue(invoice.dueDate) > 0 }">
                  {{ invoice.isPaid 
                    ? 'Paid' 
                    : (calculateDaysOverdue(invoice.dueDate) > 0 
                      ? `${calculateDaysOverdue(invoice.dueDate)} days overdue` 
                      : 'Not overdue') 
                  }}
                </td>
                <td>
                  <span :class="['status-badge', invoice.isPaid ? 'status-paid' : 'status-pending']">
                    {{ invoice.isPaid ? 'Paid' : 'Pending' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="btn-action btn-edit"
                      @click="openEditInvoiceModal(invoice)"
                      :disabled="invoice.isPaid"
                    >
                      Edit
                    </button>
                    <button
                      v-if="!invoice.isPaid"
                      class="btn-action btn-paid"
                      @click="markAsPaid(invoice.invoiceId)"
                    >
                      Mark as Paid
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else class="no-data-row">
              <td colspan="7" class="no-data-cell">
                <div class="no-data-content">
                  <i class="fas fa-search"></i>
                  <p>No invoices found</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Invoices Pagination -->
      <div class="pagination">
        <button
          class="btn-page"
          @click="goToPreviousPageInvoices"
          :disabled="currentPageInvoices === 1"
        >
          Previous
        </button>
        <button
          v-for="page in totalInvoicePages"
          :key="page"
          class="btn-page"
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
    </section>

    <!-- Modals -->
    <AddSalesModal
      v-if="isAddSalesModalOpen"
      v-model="isAddSalesModalOpen"
      @submit="handleAddSalesSubmit"
      @update:modelValue="closeAddSalesModal"
    />
    <AddInvoiceModal
      v-if="isAddInvoiceModalOpen"
      v-model="isAddInvoiceModalOpen"
      :orders="paginatedOrders"
      @submit="handleAddInvoiceSubmit"
    />
    <ViewOrderModal
      v-if="isViewOrderModalOpen"
      v-model="isViewOrderModalOpen"
      :order="viewOrder"
      @close="closeViewOrderModal"
    />
    <EditOrderModal
      v-if="isEditOrderModalOpen"
      v-model="isEditOrderModalOpen"
      :order="editOrder"
      @submit="handleEditOrderSubmit"
    />
    <EditInvoiceModal
      v-if="isEditInvoiceModalOpen"
      v-model="isEditInvoiceModalOpen"
      :invoice="editInvoice"
      @submit="handleEditInvoiceSubmit"
    />
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
  justify-content: flex-start;
}

.btn-action {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit {
  background-color: #4f46e5;
  color: white;
}

.btn-edit:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn-paid {
  background-color: #059669;
  color: white;
}

.btn-paid:hover {
  background-color: #047857;
}

.paid-row {
  background-color: #f0fdf4;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-paid {
  background-color: #d1fae5;
  color: #065f46;
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
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  margin: 1rem 0;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.95rem;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #1a202c;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.data-table tbody tr:hover {
  background: #f7fafc;
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

/* Modal Styles */
:deep(.modal-overlay) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

:deep(.modal-container) {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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

.no-data-row {
  height: 200px;
}

.no-data-cell {
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.no-data-content i {
  font-size: 2rem;
  color: #9ca3af;
}

.no-data-content p {
  font-size: 0.875rem;
  margin: 0;
}

.overdue {
  color: #dc2626;
  font-weight: 600;
}
</style>
