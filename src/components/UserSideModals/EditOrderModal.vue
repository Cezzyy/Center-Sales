<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Edit Order</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-content">
        <form id="editOrderForm" @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-section">
            <div class="section-title">Order Information</div>
            <div class="form-columns">
              <div class="form-group">
                <label>Order ID</label>
                <input
                  type="text"
                  v-model="formData.orderId"
                  class="form-control disabled-input"
                  disabled
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Customer Details</div>
            <div class="field-group">
              <div class="field-row">
                <div class="field-col">
                  <div class="form-group required">
                    <label>Customer Name</label>
                    <input
                      type="text"
                      v-model="formData.customerName"
                      :class="['form-control', { 'is-invalid': errors.customerName }]"
                      required
                    />
                    <span class="error-message" v-if="errors.customerName">{{ errors.customerName }}</span>
                  </div>
                </div>
                <div class="field-col">
                  <div class="form-group required">
                    <label>Sales Representative</label>
                    <input
                      type="text"
                      v-model="formData.salesRepresentative"
                      :class="['form-control', { 'is-invalid': errors.salesRepresentative }]"
                      required
                    />
                    <span class="error-message" v-if="errors.salesRepresentative">{{ errors.salesRepresentative }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-title">Product Details</div>
            <div class="field-group">
              <div class="field-row">
                <div class="field-col">
                  <div class="form-group required">
                    <label>Product Name</label>
                    <input
                      type="text"
                      v-model="formData.productName"
                      :class="['form-control', { 'is-invalid': errors.productName }]"
                      required
                    />
                    <span class="error-message" v-if="errors.productName">{{ errors.productName }}</span>
                  </div>
                </div>
                <div class="field-col">
                  <div class="form-group required">
                    <label>Quantity</label>
                    <input
                      type="number"
                      v-model="formData.quantity"
                      :class="['form-control', { 'is-invalid': errors.quantity }]"
                      min="1"
                      @input="calculateAmount"
                      required
                    />
                    <span class="error-message" v-if="errors.quantity">{{ errors.quantity }}</span>
                  </div>
                </div>
              </div>

              <div class="field-row">
                <div class="field-col">
                  <div class="form-group">
                    <label>Amount</label>
                    <div class="price-input">
                      <input
                        type="text"
                        :value="formattedAmount"
                        class="form-control disabled-input"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div class="field-col">
                  <div class="form-group required">
                    <label>Status</label>
                    <select
                      v-model="formData.status"
                      :class="['form-control', { 'is-invalid': errors.status }]"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
        <button type="submit" form="editOrderForm" class="btn-submit">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useOrderInvoiceStore } from '@/stores/salesStore'

const store = useOrderInvoiceStore()
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

// Initialize form data with order props
const formData = ref({
  orderId: props.order?.orderId || '',
  customerName: props.order?.customerName || '',
  salesRepresentative: props.order?.salesRepresentative || '',
  productName: props.order?.productName || '',
  quantity: props.order?.quantity || 0,
  amount: props.order?.amount || 0,
  status: props.order?.status || 'pending'
})

// Watch for changes in order prop
watch(() => props.order, (newOrder) => {
  if (newOrder) {
    formData.value = {
      orderId: newOrder.orderId || '',
      customerName: newOrder.customerName || '',
      salesRepresentative: newOrder.salesRepresentative || '',
      productName: newOrder.productName || '',
      quantity: newOrder.quantity || 0,
      amount: newOrder.amount || 0,
      status: newOrder.status || 'pending'
    }
  }
}, { deep: true })

const errors = ref({
  customerName: '',
  salesRepresentative: '',
  productName: '',
  quantity: '',
  status: ''
})

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(formData.value.amount)
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.customerName?.trim()) {
    errors.value.customerName = 'Customer name is required'
  }
  
  if (!formData.value.salesRepresentative?.trim()) {
    errors.value.salesRepresentative = 'Sales representative is required'
  }
  
  if (!formData.value.productName?.trim()) {
    errors.value.productName = 'Product name is required'
  }
  
  if (!formData.value.quantity || formData.value.quantity < 1) {
    errors.value.quantity = 'Quantity must be at least 1'
  }

  return Object.keys(errors.value).length === 0
}

const calculateAmount = () => {
  // You may want to implement your own calculation logic here
  // For now, we'll just use the existing amount
}

const closeModal = () => {
  emit('update:modelValue', false)
  errors.value = {}
  formData.value = {
    orderId: '',
    customerName: '',
    salesRepresentative: '',
    productName: '',
    quantity: 0,
    amount: 0,
    status: 'pending'
  }
}

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      await emit('submit', { ...formData.value, id: props.order.id })
      closeModal()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
}
</script>

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
}

.modal-container {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.close-button:hover {
  color: #1f2937;
}

.modal-content {
  padding: 1.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  background: #f8fafc;
  border-radius: 0.75rem;
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
  content: "*";
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-control {
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
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

.disabled-input {
  background-color: #f9fafb;
  border-color: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
  text-align: right;
  padding-right: 0.75rem;
}

.price-input .form-control {
  text-align: right;
  padding-right: 0.75rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -1.25rem;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
}

.field-group {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
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

.modal-footer {
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.btn-submit {
  padding: 0.625rem 1.25rem;
  background-color: #4f46e5;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  transition: all 0.2s;
}

.btn-submit:hover {
  background-color: #4338ca;
}

@media (max-width: 768px) {
  .modal-container {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    margin: 0;
    border-radius: 0;
  }

  .modal-header,
  .modal-footer {
    border-radius: 0;
  }

  .form-section {
    border-radius: 0.5rem;
  }

  .field-group {
    border-radius: 0.5rem;
  }

  .field-row {
    flex-direction: column;
  }

  .error-message {
    position: relative;
    bottom: 0;
    margin-top: 0.25rem;
  }
}
</style>
