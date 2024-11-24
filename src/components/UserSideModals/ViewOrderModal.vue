<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    required: true,
    default: () => ({
      orderId: '',
      customerName: '',
      productName: '',
      quantity: 0,
      salesRepresentative: '',
      amount: 0,
      status: ''
    })
  }
});

const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h2>View Order</h2>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Order ID:</label>
            <div class="info-field">{{ order.orderId }}</div>
          </div>

          <div class="form-group">
            <label>Customer Name:</label>
            <div class="info-field">{{ order.customerName }}</div>
          </div>

          <div class="form-group">
            <label>Product Name:</label>
            <div class="info-field">{{ order.productName }}</div>
          </div>

          <div class="form-group">
            <label>Quantity:</label>
            <div class="info-field">{{ order.quantity }}</div>
          </div>

          <div class="form-group">
            <label>Sales Representative:</label>
            <div class="info-field">{{ order.salesRepresentative }}</div>
          </div>

          <div class="form-group">
            <label>Amount:</label>
            <div class="info-field">${{ order.amount.toFixed(2) }}</div>
          </div>

          <div class="form-group">
            <label>Status:</label>
            <div class="info-field">{{ order.status }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">Close</button>
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

.info-field {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
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

.cancel-button:hover {
  background-color: #5a6268;
}
</style>
