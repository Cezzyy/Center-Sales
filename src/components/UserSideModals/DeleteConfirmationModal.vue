<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  client: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Confirm Deletion</h3>
      </div>
      <div class="modal-body">
        <p class="warning-message">
          Are you sure you want to delete <strong>{{ client.firstName }} {{ client.lastName }}</strong>?
        </p>
        <p class="warning-subtext">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleCancel">Cancel</button>
        <button class="confirm-btn" @click="handleConfirm">Delete</button>
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

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  margin-bottom: 1rem;
}

.modal-header h3 {
  color: #374151;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.warning-message {
  color: #374151;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.warning-message strong {
  color: #111827;
  font-weight: 600;
}

.warning-subtext {
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .confirm-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.confirm-btn {
  background-color: #ef4444;
  color: white;
}

.confirm-btn:hover {
  background-color: #dc2626;
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1rem;
  }
}
</style>
