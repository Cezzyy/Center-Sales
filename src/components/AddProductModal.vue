<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>Add New Product</h3>
        <button class="close-button" @click="closeModal">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label>Product Name</label>
          <input type="text" v-model="formData.name" required />
        </div>

        <div class="form-group">
          <label>SKU</label>
          <input type="text" v-model="formData.sku" required />
        </div>

        <div class="form-group">
          <label>Category</label>
          <select v-model="formData.category" required>
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div class="form-group">
          <label>Quantity</label>
          <select v-model="formData.quantity" required>
            <option value="">Select Quantity</option>
            <option v-for="n in 100" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Price</label>
          <div class="price-input">
            <span class="currency-symbol">$</span>
            <input type="number" v-model="formData.price" step="0.01" min="0" required />
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
          <button type="submit" class="btn-submit">Add Product</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formData = ref({
  name: '',
  sku: '',
  category: '',
  quantity: '',
  price: '',
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  emit('submit', { ...formData.value })
  formData.value = {
    name: '',
    sku: '',
    category: '',
    quantity: '',
    price: '',
  }
  closeModal()
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
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a90e2;
}

.price-input {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.price-input input {
  padding-left: 25px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-submit {
  background: #4a90e2;
  border: none;
  color: white;
}

.btn-submit:hover {
  background: #357abd;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Form validation styles */
input:invalid,
select:invalid {
  border-color: #ff4444;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .modal {
    width: 95%;
    margin: 10px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
