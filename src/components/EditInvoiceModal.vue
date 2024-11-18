<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  invoiceData: Object,
});

const emit = defineEmits(['update:modelValue', 'save']);
const formData = ref({});

// Sync orderData with formData
watch(
  () => props.invoiceData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData };
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('update:modelValue', false);
};

const handleSubmit = () => {
  emit('save', formData.value);
  closeModal();
};
</script>

<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Invoice</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Invoice Id:</label>
            <input
              type="text"
              v-model="formData.invoiceId"
              readonly
              class="form-control readonly"
            >
          </div>

          <div class="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              v-model="formData.customer"
              readonly
              class="form-control readonly"
            >
          </div>

          <div class="form-group">
            <label>Amount:</label>
            <input
              type="text"
              v-model="formData.amount"
              readonly
              class="form-control readonly"
            >
          </div>

          <div class="form-group">
            <label>Due Date:</label>
            <select
              v-model="formData.dueDate"
              class="form-control"
              required
            >
              <option value="7">7 Days</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
              <option value="45">45 Days</option>
              <option value="60">60 Days</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">Cancel</button>
          <button @click="handleSubmit" class="submit-button">Done</button>
        </div>
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

.modal-content {
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
}

.form-control.readonly {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-button {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.submit-button:hover {
  background-color: #218838;
}

.form-control:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}
</style>
