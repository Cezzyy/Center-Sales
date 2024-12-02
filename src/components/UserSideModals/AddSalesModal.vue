<script setup>
import { ref, computed, watch } from 'vue'
import { useClientStore } from '@/stores/clientStore'
import { useProductsStore } from '@/stores/productStore'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'submit'])

// Initialize stores
const clientStore = useClientStore()
const productStore = useProductsStore()

const formData = ref({
  customerName: '',
  productName: '',
  quantity: 1,
  salesRepresentative: '',
  amount: 0,
  status: 'pending',
  date: new Date().toISOString().split('T')[0]
})

// Form validation
const errors = ref({})

// Search and suggestions state
const customerSearch = ref('')
const productSearch = ref('')
const showCustomerSuggestions = ref(false)
const showProductSuggestions = ref(false)
const selectedProduct = ref(null)

// Computed properties for suggestions
const customerSuggestions = computed(() => {
  if (!customerSearch.value) return []
  const query = customerSearch.value.toLowerCase()
  return clientStore.clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(query) ||
    client.company.toLowerCase().includes(query)
  ).slice(0, 5)
})

const productSuggestions = computed(() => {
  if (!productSearch.value) return []
  const query = productSearch.value.toLowerCase()
  return productStore.products.filter(product =>
    product.name.toLowerCase().includes(query)
  ).slice(0, 5)
})

// Calculate amount based on product price and quantity
const calculateAmount = () => {
  if (selectedProduct.value && formData.value.quantity) {
    const quantity = Math.min(formData.value.quantity, selectedProduct.value.quantity)
    formData.value.quantity = quantity // Ensure quantity doesn't exceed available stock
    formData.value.amount = selectedProduct.value.price * quantity
  } else {
    formData.value.amount = 0
  }
}

// Format price in PHP
const formattedAmount = computed(() => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(formData.value.amount)
})

// Watch for quantity changes to update amount
watch(() => formData.value.quantity, () => {
  calculateAmount()
})

// Generate a random order ID
const generatedOrderId = computed(() => {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
})

// Form validation
const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.customerName) {
    errors.value.customerName = 'Customer name is required'
  }
  
  if (!formData.value.productName) {
    errors.value.productName = 'Product name is required'
  }
  
  if (!formData.value.quantity || formData.value.quantity < 1) {
    errors.value.quantity = 'Quantity must be at least 1'
  } else if (selectedProduct.value && formData.value.quantity > selectedProduct.value.quantity) {
    errors.value.quantity = 'Quantity exceeds available stock'
  }
  
  if (!formData.value.salesRepresentative) {
    errors.value.salesRepresentative = 'Sales representative is required'
  }
  
  return Object.keys(errors.value).length === 0
}

// Validate quantity input
const validateQuantity = (event) => {
  const value = parseInt(event.target.value)
  
  if (isNaN(value) || value < 1) {
    formData.value.quantity = 1
    errors.value.quantity = 'Quantity must be at least 1'
  } else if (selectedProduct.value && value > selectedProduct.value.quantity) {
    formData.value.quantity = selectedProduct.value.quantity
    errors.value.quantity = `Maximum available quantity is ${selectedProduct.value.quantity}`
  } else {
    errors.value.quantity = null
    formData.value.quantity = value
  }
  
  calculateAmount()
}

// Handle customer selection
const selectCustomer = (client) => {
  formData.value.customerName = `${client.firstName} ${client.lastName}`
  customerSearch.value = formData.value.customerName
  showCustomerSuggestions.value = false
  errors.value.customerName = null
}

// Handle product selection
const selectProduct = (product) => {
  selectedProduct.value = product
  formData.value.productName = product.name
  productSearch.value = product.name
  showProductSuggestions.value = false
  errors.value.productName = null
  calculateAmount()
}

const closeModal = () => {
  emit('update:modelValue', false)
  // Reset form and errors
  errors.value = {}
  formData.value = {
    customerName: '',
    productName: '',
    quantity: 1,
    salesRepresentative: '',
    amount: 0,
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  }
  customerSearch.value = ''
  productSearch.value = ''
  selectedProduct.value = null
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      ...formData.value,
      orderId: generatedOrderId.value,
    })
    closeModal()
  }
}
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Add New Order</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-content">
        <form id="orderForm" @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-section">
            <div class="section-title">Order Information</div>
            <div class="form-columns">
              <div class="form-group">
                <label>Order ID</label>
                <input 
                  type="text" 
                  :value="generatedOrderId" 
                  disabled 
                  class="form-control disabled-input" 
                />
              </div>

              <div class="form-group required">
                <label>Customer Name</label>
                <div class="autocomplete">
                  <input
                    type="text"
                    v-model="customerSearch"
                    :class="['form-control', { 'is-invalid': errors.customerName }]"
                    required
                    placeholder="Search customer..."
                    @focus="showCustomerSuggestions = true"
                    @blur="setTimeout(() => showCustomerSuggestions = false, 200)"
                  />
                  <div v-if="showCustomerSuggestions && customerSuggestions.length" class="suggestions">
                    <div
                      v-for="client in customerSuggestions"
                      :key="client.id"
                      class="suggestion-item"
                      @mousedown="selectCustomer(client)"
                    >
                      {{ client.firstName }} {{ client.lastName }} - {{ client.company }}
                    </div>
                  </div>
                  <span class="error-message" v-if="errors.customerName">{{ errors.customerName }}</span>
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
                    <div class="autocomplete">
                      <input
                        type="text"
                        v-model="productSearch"
                        :class="['form-control', { 'is-invalid': errors.productName }]"
                        required
                        placeholder="Search product..."
                        @focus="showProductSuggestions = true"
                        @blur="setTimeout(() => showProductSuggestions = false, 200)"
                      />
                      <div v-if="showProductSuggestions && productSuggestions.length" class="suggestions">
                        <div
                          v-for="product in productSuggestions"
                          :key="product.id"
                          class="suggestion-item"
                          @mousedown="selectProduct(product)"
                        >
                          {{ product.name }} - ${{ product.price }}
                        </div>
                      </div>
                      <span class="error-message" v-if="errors.productName">{{ errors.productName }}</span>
                    </div>
                  </div>
                </div>
                <div class="field-col">
                  <div class="form-group required">
                    <label>Quantity</label>
                    <input
                      type="number"
                      v-model.number="formData.quantity"
                      :class="['form-control', { 'is-invalid': errors.quantity }]"
                      min="1"
                      :max="selectedProduct?.quantity || 1"
                      @input="validateQuantity"
                      required
                    />
                    <span class="error-message" v-if="errors.quantity">{{ errors.quantity }}</span>
                    <div class="form-hint" v-if="selectedProduct">
                      Available: {{ selectedProduct.quantity }}
                    </div>
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
                        class="form-control"
                        disabled
                      />
                    </div>
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
                      placeholder="Enter sales representative name"
                    />
                    <span class="error-message" v-if="errors.salesRepresentative">{{ errors.salesRepresentative }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
        <button type="submit" form="orderForm" class="btn-submit">Create Order</button>
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

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.375rem;
  font-weight: 500;
}

.field-group {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
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

.autocomplete {
  position: relative;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.25rem;
}

.suggestion-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f7fafc;
}

.suggestion-item:first-child {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.suggestion-item:last-child {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
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
  border-radius: 6px;
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
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  transition: all 0.2s;
}

.btn-submit:hover {
  background-color: #4338ca;
}

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

  .modal-header,
  .modal-footer {
    border-radius: 0;
  }

  .modal-content {
    flex-direction: column;
  }

  .modal-form {
    width: 100%;
    border-right: none;
  }

  .field-row {
    flex-direction: column;
  }

  .error-message {
    position: relative;
    bottom: 0;
    margin-top: 0.25rem;
  }

  .form-section {
    border-radius: 0.5rem;
  }

  .field-group {
    border-radius: 0.5rem;
  }
}
</style>
