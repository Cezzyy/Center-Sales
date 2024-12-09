<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ report ? 'Edit Report' : 'View Report' }}</h2>
        <button class="close-button" @click="handleClose">×</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="validateAndSubmit" novalidate>
          <div class="form-row">
            <!-- Report ID -->
            <div class="form-group">
              <label for="reportId">Report ID</label>
              <input id="reportId" v-model="formData.reportId" type="text" readonly />
            </div>

            <!-- Order ID -->
            <div class="form-group">
              <label for="orderId">Order ID</label>
              <input id="orderId" v-model="formData.orderId" type="text" readonly />
            </div>
          </div>

          <div class="form-row">
            <!-- Customer Name -->
            <div class="form-group">
              <label for="customerName">Customer Name <span class="required">*</span></label>
              <input
                id="customerName"
                v-model="formData.customerName"
                type="text"
                :readonly="!canEdit"
                required
                @blur="validateField('customerName')"
                :class="{ error: errors.customerName }"
              />
              <span v-if="errors.customerName" class="error-message">{{
                errors.customerName
              }}</span>
            </div>

            <!-- Product Name -->
            <div class="form-group">
              <label for="productName">Product <span class="required">*</span></label>
              <input
                id="productName"
                v-model="formData.productName"
                type="text"
                :readonly="!canEdit"
                required
                @blur="validateField('productName')"
                :class="{ error: errors.productName }"
              />
              <span v-if="errors.productName" class="error-message">{{ errors.productName }}</span>
            </div>
          </div>

          <div class="form-row">
            <!-- Quantity -->
            <div class="form-group">
              <label for="quantity">Quantity <span class="required">*</span></label>
              <input
                id="quantity"
                v-model.number="formData.quantity"
                type="number"
                min="1"
                :readonly="!canEdit"
                required
                @blur="validateField('quantity')"
                :class="{ error: errors.quantity }"
              />
              <span v-if="errors.quantity" class="error-message">{{ errors.quantity }}</span>
            </div>

            <!-- Amount -->
            <div class="form-group">
              <label for="amount">Amount (₱) <span class="required">*</span></label>
              <input
                id="amount"
                v-model.number="formData.amount"
                type="number"
                min="0"
                step="0.01"
                :readonly="!canEdit"
                required
                @blur="validateField('amount')"
                :class="{ error: errors.amount }"
              />
              <span v-if="errors.amount" class="error-message">{{ errors.amount }}</span>
            </div>
          </div>

          <div class="form-row">
            <!-- Sales Rep -->
            <div class="form-group">
              <label for="salesRep">Sales Representative <span class="required">*</span></label>
              <input
                id="salesRep"
                v-model="formData.salesRep"
                type="text"
                :readonly="!canEdit"
                required
                @blur="validateField('salesRep')"
                :class="{ error: errors.salesRep }"
              />
              <span v-if="errors.salesRep" class="error-message">{{ errors.salesRep }}</span>
            </div>

            <!-- Order Date -->
            <div class="form-group">
              <label for="orderDate">Order Date <span class="required">*</span></label>
              <input
                id="orderDate"
                v-model="formData.orderDate"
                type="date"
                :readonly="!canEdit"
                required
                @blur="validateField('orderDate')"
                :class="{ error: errors.orderDate }"
              />
              <span v-if="errors.orderDate" class="error-message">{{ errors.orderDate }}</span>
            </div>
          </div>

          <div class="form-row">
            <!-- Due Date -->
            <div class="form-group">
              <label for="dueDate">Due Date <span class="required">*</span></label>
              <input
                id="dueDate"
                v-model="formData.dueDate"
                type="date"
                :readonly="!canEdit"
                required
                @blur="validateField('dueDate')"
                :class="{ error: errors.dueDate }"
              />
              <span v-if="errors.dueDate" class="error-message">{{ errors.dueDate }}</span>
            </div>

            <!-- Status -->
            <div class="form-group">
              <label for="status">Status <span class="required">*</span></label>
              <select
                id="status"
                v-model="formData.status"
                :disabled="!canEdit"
                required
                @blur="validateField('status')"
                :class="{ error: errors.status }"
              >
                <option value="" disabled>Select Status</option>
                <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
              <span v-if="errors.status" class="error-message">{{ errors.status }}</span>
            </div>
          </div>

          <div class="form-row">
            <!-- Payment Status -->
            <div class="form-group">
              <label for="paymentStatus">Payment Status <span class="required">*</span></label>
              <select
                id="paymentStatus"
                v-model="formData.paymentStatus"
                :disabled="!canEdit"
                required
                @blur="validateField('paymentStatus')"
                :class="{ error: errors.paymentStatus }"
              >
                <option value="" disabled>Select Payment Status</option>
                <option
                  v-for="status in paymentStatusOptions"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
              <span v-if="errors.paymentStatus" class="error-message">{{
                errors.paymentStatus
              }}</span>
            </div>
          </div>

          <!-- Submit Button - Only show if user can edit -->
          <div v-if="canEdit" class="form-actions">
            <button type="submit" class="submit-button" :disabled="hasErrors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { usePermissionsStore } from '../../stores/permissionsStore'
import { useActivityLog } from '@/composables/useActivityLog'

const { logAction } = useActivityLog()
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  report: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'update'])

const permissionsStore = usePermissionsStore()
const canEdit = computed(() => permissionsStore.hasPermission('write'))

// Status options
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

// Payment status options
const paymentStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

const formData = ref({
  reportId: '',
  orderId: '',
  customerName: '',
  productName: '',
  quantity: 0,
  amount: 0,
  salesRep: '',
  orderDate: '',
  dueDate: '',
  status: 'pending', // Default value
  paymentStatus: 'pending', // Default value
})

const errors = ref({})
const hasErrors = computed(() => Object.values(errors.value).some((error) => error))

const validateField = (field) => {
  errors.value[field] = ''

  switch (field) {
    case 'customerName':
      if (!formData.value.customerName?.trim()) {
        errors.value.customerName = 'Customer name is required'
      } else if (formData.value.customerName.length < 2) {
        errors.value.customerName = 'Customer name must be at least 2 characters'
      }
      break

    case 'productName':
      if (!formData.value.productName?.trim()) {
        errors.value.productName = 'Product name is required'
      }
      break

    case 'quantity':
      if (!formData.value.quantity) {
        errors.value.quantity = 'Quantity is required'
      } else if (formData.value.quantity < 1) {
        errors.value.quantity = 'Quantity must be at least 1'
      }
      break

    case 'amount':
      if (!formData.value.amount && formData.value.amount !== 0) {
        errors.value.amount = 'Amount is required'
      } else if (formData.value.amount < 0) {
        errors.value.amount = 'Amount cannot be negative'
      }
      break

    case 'salesRep':
      if (!formData.value.salesRep?.trim()) {
        errors.value.salesRep = 'Sales representative is required'
      }
      break

    case 'orderDate':
      if (!formData.value.orderDate) {
        errors.value.orderDate = 'Order date is required'
      }
      break

    case 'dueDate':
      if (!formData.value.dueDate) {
        errors.value.dueDate = 'Due date is required'
      } else if (formData.value.dueDate < formData.value.orderDate) {
        errors.value.dueDate = 'Due date cannot be before order date'
      }
      break

    case 'status':
      if (!formData.value.status?.trim()) {
        errors.value.status = 'Status is required'
      }
      break

    case 'paymentStatus':
      if (!formData.value.paymentStatus?.trim()) {
        errors.value.paymentStatus = 'Payment status is required'
      }
      break
  }
}

const validateForm = () => {
  const fields = [
    'customerName',
    'productName',
    'quantity',
    'amount',
    'salesRep',
    'orderDate',
    'dueDate',
    'status',
    'paymentStatus',
  ]

  let isValid = true
  fields.forEach((field) => {
    validateField(field)
    if (errors.value[field]) {
      isValid = false
    }
  })
  return isValid
}

const validateAndSubmit = () => {
  const isValid = validateForm()
  if (!isValid) {
    return
  }

  // Additional check for dropdowns
  if (!formData.value.status || !formData.value.paymentStatus) {
    if (!formData.value.status) {
      errors.value.status = 'Status is required'
    }
    if (!formData.value.paymentStatus) {
      errors.value.paymentStatus = 'Payment status is required'
    }
    return
  }

  // Check if any changes were made
  const changedFields = Object.keys(formData.value).filter(
    (key) => formData.value[key] !== props.report[key]
  )

  if (changedFields.length > 0) {
    // Only log if changes were made
    logAction({
      action: 'UPDATE_REPORT',
      category: 'reports',
      details: `Updated report #${formData.value.reportId} - Changed fields: ${changedFields.join(', ')}`,
      targetId: formData.value.reportId,
      additionalData: {
        changedFields,
        oldValues: changedFields.reduce((acc, field) => {
          acc[field] = props.report[field]
          return acc
        }, {}),
        newValues: changedFields.reduce((acc, field) => {
          acc[field] = formData.value[field]
          return acc
        }, {})
      },
    })
  }

  emit('update', { ...formData.value })
  handleClose()
}

onMounted(() => {
  if (props.report) {
    const report = { ...props.report }
    // Format dates for input type="date"
    if (report.orderDate) {
      report.orderDate = new Date(report.orderDate).toISOString().split('T')[0]
    }
    if (report.dueDate) {
      report.dueDate = new Date(report.dueDate).toISOString().split('T')[0]
    }

    // Ensure status and paymentStatus have valid values
    report.status = report.status || 'pending'
    report.paymentStatus = report.paymentStatus || 'pending'

    formData.value = report
  }
})

const handleClose = () => {
  errors.value = {}
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.close-button:hover {
  color: #1e293b;
}

.modal-body {
  padding: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-weight: 500;
}

.required {
  color: #dc2626;
  margin-left: 2px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-group input:read-only,
.form-group select:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
}

.form-group input.error,
.form-group select.error {
  border-color: #dc2626;
}

.error-message {
  position: absolute;
  bottom: -20px;
  left: 0;
  color: #dc2626;
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }

  .error-message {
    position: relative;
    bottom: auto;
    margin-top: 0.25rem;
  }
}
</style>
