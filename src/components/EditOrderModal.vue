<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Order</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Order ID:</label>
            <input
              type="text"
              v-model="formData.orderId"
              readonly
              class="form-control readonly"
            >
          </div>

          <div class="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              v-model="formData.customerName"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              v-model="formData.productName"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              v-model="formData.quantity"
              class="form-control"
              min="1"
              @input="calculateAmount"
              required
            >
          </div>

          <div class="form-group">
            <label>Sales Representative:</label>
            <input
              type="text"
              v-model="formData.salesRepresentative"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label>Amount:</label>
            <input
              type="text"
              v-model="formData.amount"
              class="form-control readonly"
              readonly
            >
          </div>

          <div class="form-group">
            <label>Status:</label>
            <select
              v-model="formData.status"
              class="form-control"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">Cancel</button>
          <button @click="submitForm" class="submit-button">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  orderData: Object,
});

const emit = defineEmits(['update:modelValue', 'submit']);

const formData = ref({});

// Sync orderData with formData
watch(
  () => props.orderData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }; // Deep copy the data
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('update:modelValue', false);
};

const submitForm = () => {
  emit('submit', { ...formData.value }); // Emit the updated data
  closeModal();
};
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
