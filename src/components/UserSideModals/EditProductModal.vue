<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Edit Product</h2>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              required
            />
          </div>

          <div class="form-group">
            <label for="sku">SKU:</label>
            <input
              type="text"
              id="sku"
              v-model="formData.sku"
              required
            />
          </div>

          <div class="form-group">
            <label for="category">Category:</label>
            <select
              id="category"
              v-model="formData.category"
              required
            >
              <option value="">Select Category</option>
              <option
                v-for="category in props.categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              v-model="formData.quantity"
              min="0"
              required
            />
          </div>

          <div class="form-group">
            <label for="price">Price:</label>
            <input
              type="number"
              id="price"
              v-model="formData.price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn-done">
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  productData: Object,
});

const emit = defineEmits(['update:modelValue', 'submit']);

const formData = ref({});

// Sync orderData with formData
watch(
  () => props.productData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }; // Deep copy the data
    }
  },
  { immediate: true }
);
// Watch for changes in the product prop and update form data
// watch(
//   () => props.product,
//   (newValue) => {
//     Object.assign(formData, newValue)
//   },
//   { immediate: true, deep: true }
// )

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  emit('submit', { ...formData })
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
}

.modal-container {
  background-color: white;
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

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-done {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel {
  background-color: #f1f1f1;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e4e4e4;
}

.btn-done {
  background-color: #4a90e2;
  color: white;
}

.btn-done:hover {
  background-color: #357abd;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
