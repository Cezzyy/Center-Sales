<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  orders: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const selectedOrderId = ref('')
const dueDate = ref('')

// Generate a random invoice ID
const generatedInvoiceId = computed(() => {
  return 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase()
})

// Get the minimum due date (today)
const minDueDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Get customer name from selected order
const customerName = computed(() => {
  if (!selectedOrderId.value) return ''
  const selectedOrder = props.orders.find(order => order.orderId === selectedOrderId.value)
  return selectedOrder ? selectedOrder.customerName : ''
})

// Get amount from selected order
const amount = computed(() => {
  if (!selectedOrderId.value) return ''
  const selectedOrder = props.orders.find(order => order.orderId === selectedOrderId.value)
  return selectedOrder ? selectedOrder.amount : ''
})

const closeModal = () => {
  emit('update:modelValue', false)
  selectedOrderId.value = ''
  dueDate.value = ''
}

const handleSubmit = () => {
  emit('submit', {
    invoiceId: generatedInvoiceId.value,
    orderId: selectedOrderId.value,
    customerName: customerName.value,
    amount: amount.value,
    dueDate: dueDate.value
  })
  closeModal()
}
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <h2>Add Invoice</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Invoice ID:</label>
          <input type="text" :value="generatedInvoiceId" disabled />
        </div>

        <div class="form-group">
          <label>Select Order:</label>
          <select
            v-model="selectedOrderId"
            required
          >
            <option value="">Select an order</option>
            <option
              v-for="order in orders"
              :key="order.orderId"
              :value="order.orderId"
            >
              {{ order.orderId }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Customer Name:</label>
          <input
            type="text"
            :value="customerName"
            disabled
          />
        </div>

        <div class="form-group">
          <label>Amount:</label>
          <input
            type="text"
            :value="amount"
            disabled
          />
        </div>

        <div class="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            v-model="dueDate"
            :min="minDueDate"
            required
          />
        </div>

        <div class="button-group">
          <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
          <button type="submit" class="add-btn">Add</button>
        </div>
      </form>
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
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  color: #666;
}

select {
  background-color: white;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #4CAF50;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #d0d0d0;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
}

.add-btn:hover {
  background-color: #45a049;
}
</style>
