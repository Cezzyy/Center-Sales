<script setup>
import { computed } from 'vue';

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
};
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>View Order</h2>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>

      <div class="modal-content">
        <!-- Order Information Section -->
        <div class="form-section">
          <div class="section-title">Order Information</div>
          <div class="form-group">
            <label>Order ID</label>
            <div class="info-field">{{ order.orderId }}</div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <div class="info-field status-badge" :class="order.status.toLowerCase()">
              {{ order.status }}
            </div>
          </div>
        </div>

        <!-- Customer Details Section -->
        <div class="form-section">
          <div class="section-title">Customer Details</div>
          <div class="form-group">
            <label>Customer Name</label>
            <div class="info-field">{{ order.customerName }}</div>
          </div>
          <div class="form-group">
            <label>Sales Representative</label>
            <div class="info-field">{{ order.salesRepresentative }}</div>
          </div>
        </div>

        <!-- Product Details Section -->
        <div class="form-section">
          <div class="section-title">Product Details</div>
          <div class="form-group">
            <label>Product Name</label>
            <div class="info-field">{{ order.productName }}</div>
          </div>
          <div class="form-columns">
            <div class="form-group">
              <label>Quantity</label>
              <div class="info-field">{{ order.quantity }}</div>
            </div>
            <div class="form-group">
              <label>Amount</label>
              <div class="info-field amount">{{ formatCurrency(order.amount) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-cancel">Close</button>
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
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
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

.form-section {
  margin-bottom: 2rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.info-field {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 0.875rem;
}

.info-field.amount {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.form-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #4b5563;
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }

  .form-columns {
    grid-template-columns: 1fr;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 1rem;
  }
}
</style>
