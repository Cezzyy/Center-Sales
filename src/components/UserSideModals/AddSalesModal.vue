<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  productPrice: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formData = ref({
  customerName: '',
  productName: '',
  quantity: 1,
  salesRep: ''
})

// Generate a random order ID (you might want to implement your own logic)
const generatedOrderId = computed(() => {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
})

// Calculate amount based on quantity and product price
const calculatedAmount = computed(() => {
  return `$${(formData.value.quantity * props.productPrice).toFixed(2)}`
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    orderId: generatedOrderId.value,
    amount: calculatedAmount.value
  })
  formData.value = {
    customerName: '',
    productName: '',
    quantity: 1,
    salesRep: ''
  }
  closeModal()
}
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <h2>Add Sales</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Order ID:</label>
          <input type="text" :value="generatedOrderId" disabled />
        </div>

        <div class="form-group">
          <label>Customer Name:</label>
          <input
            type="text"
            v-model="formData.customerName"
            required
          />
        </div>

        <div class="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            v-model="formData.productName"
            required
          />
        </div>

        <div class="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            v-model="formData.quantity"
            min="1"
            required
          />
        </div>

        <div class="form-group">
          <label>Sales Representative:</label>
          <input
            type="text"
            v-model="formData.salesRep"
            required
          />
        </div>

        <div class="form-group">
          <label>Amount of Sales:</label>
          <input type="text" :value="calculatedAmount" disabled />
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

input {
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
