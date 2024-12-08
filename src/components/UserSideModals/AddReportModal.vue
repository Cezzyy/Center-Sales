<script setup>
import { ref, computed } from 'vue'
// import { useReportsStore } from '@/stores/reportsStore'
import { useOrderInvoiceStore } from '@/stores/salesStore'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'submit'])
// const reportsStore = useReportsStore()
const orderStore = useOrderInvoiceStore()

const errors = ref({})
const selectedOrderId = ref('')
const dueDate = ref('')

// Get orders from the store
const orders = computed(() => orderStore.orders)

// Generate a random report ID
const generatedReportId = computed(() => {
  return 'RPT-' + Math.random().toString(36).substr(2, 9).toUpperCase()
})

// Get the minimum due date (today)
const minDueDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Get selected order details
const selectedOrder = computed(() => {
  if (!selectedOrderId.value) return null
  return orders.value.find((order) => order.orderId === selectedOrderId.value)
})

// Computed properties for form fields
const orderDetails = computed(() => {
  if (!selectedOrder.value)
    return {
      customerName: '',
      productName: '',
      quantity: '',
      amount: '',
      salesRep: '',
      date: '',
    }

  return {
    customerName: selectedOrder.value.customerName,
    productName: selectedOrder.value.productName,
    quantity: selectedOrder.value.quantity,
    amount: selectedOrder.value.amount,
    salesRep: selectedOrder.value.salesRepresentative,
    date: selectedOrder.value.date,
  }
})

const validateForm = () => {
  errors.value = {}

  if (!selectedOrderId.value) {
    errors.value.order = 'Please select an order'
  }

  if (!dueDate.value) {
    errors.value.dueDate = 'Due date is required'
  }

  return Object.keys(errors.value).length === 0
}

const closeModal = () => {
  emit('update:modelValue', false)
  selectedOrderId.value = ''
  dueDate.value = ''
  errors.value = {}
}

const handleSubmit = () => {
  if (validateForm()) {
    const reportData = {
      reportId: generatedReportId.value,
      orderId: selectedOrderId.value,
      customerName: orderDetails.value.customerName,
      productName: orderDetails.value.productName,
      quantity: orderDetails.value.quantity,
      amount: parseFloat(orderDetails.value.amount),
      salesRep: orderDetails.value.salesRep,
      orderDate: orderDetails.value.date,
      dueDate: dueDate.value,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      date: new Date().toISOString().split('T')[0],
    }

    // Emit report data to parent instead of calling store directly
    emit('submit', reportData)

    // Close modal and reset form
    closeModal()
  }
}
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">Create Report</h3>
        <button @click="closeModal" class="close-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="close-icon"
          >
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-content">
        <form id="reportForm" @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-section">
            <div class="section-title">Report Information</div>
            <div class="form-columns">
              <div class="form-group">
                <label>Report ID</label>
                <input
                  type="text"
                  :value="generatedReportId"
                  disabled
                  class="form-control disabled-input"
                />
              </div>

              <div class="form-group required">
                <label>Select Order</label>
                <select
                  v-model="selectedOrderId"
                  :class="['form-control', { 'is-invalid': errors.order }]"
                >
                  <option value="">Choose an order</option>
                  <option v-for="order in orders" :key="order.orderId" :value="order.orderId">
                    {{ order.orderId }} - {{ order.customerName }}
                  </option>
                </select>
                <span class="error-message" v-if="errors.order">{{ errors.order }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Order Details</div>
            <div class="field-group">
              <div class="field-row">
                <div class="field-col">
                  <div class="form-group">
                    <label>Client Name</label>
                    <input
                      type="text"
                      :value="orderDetails.customerName"
                      disabled
                      class="form-control disabled-input"
                    />
                  </div>
                </div>
                <div class="field-col">
                  <div class="form-group">
                    <label>Product</label>
                    <input
                      type="text"
                      :value="orderDetails.productName"
                      disabled
                      class="form-control disabled-input"
                    />
                  </div>
                </div>
              </div>

              <div class="field-row">
                <div class="field-col">
                  <div class="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      :value="orderDetails.quantity"
                      disabled
                      class="form-control disabled-input"
                    />
                  </div>
                </div>
                <div class="field-col">
                  <div class="form-group">
                    <label>Amount (PHP)</label>
                    <div class="price-input">
                      <span class="currency-symbol">₱</span>
                      <input
                        type="number"
                        :value="orderDetails.amount"
                        disabled
                        class="form-control disabled-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="field-row">
                <div class="field-col">
                  <div class="form-group">
                    <label>Sales Representative</label>
                    <input
                      type="text"
                      :value="orderDetails.salesRep"
                      disabled
                      class="form-control disabled-input"
                    />
                  </div>
                </div>
                <div class="field-col">
                  <div class="form-group">
                    <label>Order Date</label>
                    <input
                      type="date"
                      :value="orderDetails.date"
                      disabled
                      class="form-control disabled-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="field-group">
              <div class="field-group-title">Report Schedule</div>
              <div class="form-group required">
                <label>Due Date</label>
                <input
                  type="date"
                  v-model="dueDate"
                  :min="minDueDate"
                  :class="['form-control', { 'is-invalid': errors.dueDate }]"
                />
                <span class="error-message" v-if="errors.dueDate">{{ errors.dueDate }}</span>
                <div class="form-hint">Select a date after the order date</div>
              </div>
            </div>
          </div>
        </form>

        <div class="order-preview">
          <div class="preview-content">
            <div class="preview-header">
              <h3>Order Preview</h3>
            </div>

            <div class="preview-section">
              <div class="preview-section-header">
                <h4>Order Details</h4>
              </div>
              <div class="preview-data">
                <div class="preview-row">
                  <span class="preview-label">Order ID:</span>
                  <span class="preview-value">{{
                    selectedOrder ? selectedOrder.orderId : ''
                  }}</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Customer Name:</span>
                  <span class="preview-value">{{
                    selectedOrder ? selectedOrder.customerName : ''
                  }}</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Product:</span>
                  <span class="preview-value">{{
                    selectedOrder ? selectedOrder.productName : ''
                  }}</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Quantity:</span>
                  <span class="preview-value">{{
                    selectedOrder ? selectedOrder.quantity : ''
                  }}</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Amount (PHP):</span>
                  <span class="preview-value"
                    >₱ {{ selectedOrder ? selectedOrder.amount : '' }}</span
                  >
                </div>
                <div class="preview-row">
                  <span class="preview-label">Sales Representative:</span>
                  <span class="preview-value">{{
                    selectedOrder ? selectedOrder.salesRepresentative : ''
                  }}</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Order Date:</span>
                  <span class="preview-value">{{ selectedOrder ? selectedOrder.date : '' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
        <button type="submit" form="reportForm" class="btn-submit">Create Report</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 95%;
  max-width: 1000px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: modal-appear 0.3s ease-out;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 2rem);
}

.modal-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
}

.modal-form {
  padding: 1.5rem;
  width: 45%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: white;
  border-right: 1px solid #e5e7eb;
}

.order-preview {
  flex: 1;
  padding: 1.5rem;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  overflow-y: auto;
}

.preview-content {
  max-width: 600px;
  margin: 0 auto;
}

.preview-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4f46e5;
}

.preview-header h3 {
  color: #1e293b;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
}

.preview-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.preview-section-header {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.preview-section-header h4 {
  color: #1e293b;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 600;
}

.preview-data {
  padding: 1rem;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.preview-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.preview-row:first-child {
  padding-top: 0;
}

.preview-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.preview-value {
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 600;
}

.preview-value.highlight {
  color: #4f46e5;
}

.preview-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-completed {
  background-color: #dcfce7;
  color: #166534;
}

.status-unpaid {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-paid {
  background-color: #dbeafe;
  color: #1e40af;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to right, #4f46e5, #4338ca);
}

.modal-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  color: white;
  opacity: 0.8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.close-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f8fafc;
  border-radius: 0 0 12px 12px;
}

.btn-cancel {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.btn-submit {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  background: linear-gradient(to right, #4f46e5, #4338ca);
  border: none;
  color: white;
  transition: all 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .modal-form {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .modal-container {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    margin: 0;
    border-radius: 0;
  }

  .modal-header {
    border-radius: 0;
  }

  .modal-content {
    flex-direction: column;
  }

  .modal-form {
    width: 100%;
    border-right: none;
  }

  .order-preview {
    border-top: 1px solid #e5e7eb;
  }

  .preview-content {
    max-width: 100%;
  }

  .modal-footer {
    border-radius: 0;
  }

  .btn-cancel,
  .btn-submit {
    flex: 1;
  }
}

.form-section {
  margin-bottom: 2rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.25rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 0.875rem;
  color: #4f46e5;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
}

.form-columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.375rem;
  color: #4b5563;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: color 0.2s;
}

.form-group.required label::after {
  content: '*';
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-control {
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s;
}

.form-control:hover:not(:disabled) {
  border-color: #d1d5db;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

select.form-control {
  padding-right: 2rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}

.disabled-input {
  background-color: #f9fafb;
  border-color: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
}

.error {
  border-color: #ef4444 !important;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -1.25rem;
  color: #ef4444;
  font-size: 0.75rem;
}

.price-input {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 500;
  pointer-events: none;
}

.price-input .form-control {
  padding-left: 1.75rem;
}

/* Form Field Groups */
.field-group {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.field-group-title {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.field-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.field-row:last-child {
  margin-bottom: 0;
}

.field-col {
  flex: 1;
}

/* Form Hints */
.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Form Validation States */
.form-control.is-valid {
  border-color: #10b981;
  padding-right: 2.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}

.form-control.is-invalid {
  border-color: #ef4444;
  padding-right: 2.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ef4444'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}
</style>
