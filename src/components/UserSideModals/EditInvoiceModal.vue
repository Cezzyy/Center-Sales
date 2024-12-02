<script setup>
import { ref, watch } from 'vue';
import { useOrderInvoiceStore } from '@/stores/salesStore';

const store = useOrderInvoiceStore();
const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'save']);
const formData = ref({
  invoiceId: '',
  customer: '',
  amount: 0,
  dueDate: ''
});
const errors = ref({});

// Watch for changes in the store's editInvoice
watch(() => store.editInvoice, (newInvoice) => {
  if (newInvoice) {
    formData.value = { ...newInvoice };
  }
}, { immediate: true });

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
};

const validateForm = () => {
  errors.value = {};
  if (!formData.value.dueDate) {
    errors.value.dueDate = 'Due date is required';
    return false;
  }
  return true;
};

const closeModal = () => {
  emit('update:modelValue', false);
  errors.value = {};
};

const handleSubmit = () => {
  if (validateForm()) {
    store.handleEditInvoiceSubmit(formData.value);
    closeModal();
  }
};
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Edit Invoice</h2>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>

      <div class="modal-content">
        <!-- Invoice Information Section -->
        <div class="form-section">
          <div class="section-title">Invoice Information</div>
          <div class="form-group">
            <label>Invoice ID</label>
            <div class="info-field">{{ formData.invoiceId }}</div>
          </div>
        </div>

        <!-- Customer Details Section -->
        <div class="form-section">
          <div class="section-title">Customer Details</div>
          <div class="form-group">
            <label>Customer Name</label>
            <div class="info-field">{{ formData.customer }}</div>
          </div>
          <div class="form-group">
            <label>Amount</label>
            <div class="info-field amount">{{ formatCurrency(formData.amount) }}</div>
          </div>
        </div>

        <!-- Payment Terms Section -->
        <div class="form-section">
          <div class="section-title">Payment Terms</div>
          <div class="form-group required">
            <label>Due Date</label>
            <input
              type="date"
              v-model="formData.dueDate"
              :class="['form-control', { 'is-invalid': errors.dueDate }]"
              required
            >
            <span class="error-message" v-if="errors.dueDate">{{ errors.dueDate }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-cancel">Cancel</button>
        <button @click="handleSubmit" class="btn-submit">Save Changes</button>
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

.form-group.required label::after {
  content: "*";
  color: #ef4444;
  margin-left: 0.25rem;
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

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-control.is-invalid {
  border-color: #ef4444;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

input[type="date"].form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3e%3c/rect%3e%3cline x1='16' y1='2' x2='16' y2='6'%3e%3c/line%3e%3cline x1='8' y1='2' x2='8' y2='6'%3e%3c/line%3e%3cline x1='3' y1='10' x2='21' y2='10'%3e%3c/line%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
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

.btn-submit {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #4338ca;
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 1rem;
  }
}
</style>
