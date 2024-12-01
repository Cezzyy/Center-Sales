<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Edit Product</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              :class="{ 'error': errors.name }"
              placeholder="Enter product name"
            />
            <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="sku">SKU (Read-only)</label>
            <input
              type="text"
              id="sku"
              v-model="formData.sku"
              disabled
              class="disabled-input"
            />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select
              id="category"
              v-model="formData.category"
              :class="{ 'error': errors.category }"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Accessories">Accessories</option>
            </select>
            <span class="error-message" v-if="errors.category">{{ errors.category }}</span>
          </div>

          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              v-model="formData.quantity"
              min="0"
              @input="handleQuantityInput"
              onkeypress="return event.charCode >= 48"
              :class="{ 'error': errors.quantity }"
            />
            <span class="error-message" v-if="errors.quantity">{{ errors.quantity }}</span>
          </div>

          <div class="form-group">
            <label for="price">Price (PHP)</label>
            <div class="price-input" :class="{ 'error': errors.price }">
              <span class="currency-symbol">₱</span>
              <input
                type="number"
                id="price"
                v-model="formData.price"
                min="0"
                step="0.01"
                @input="handlePriceInput"
                onkeypress="return event.charCode >= 48"
                placeholder="0.00"
              />
            </div>
            <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-submit">Update Product</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useProductsStore } from '@/stores/productStore';

const props = defineProps({
  modelValue: Boolean,
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
const store = useProductsStore();
const errors = ref({});

const formData = ref({
  id: '',
  name: '',
  sku: '',
  category: '',
  quantity: '',
  price: '',
});

// Watch for changes in the product prop and update form data
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      formData.value = { ...newProduct };
    }
  },
  { immediate: true, deep: true }
);

const validateForm = () => {
  errors.value = {};
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Product name is required';
  } else if (formData.value.name.length < 3) {
    errors.value.name = 'Product name must be at least 3 characters';
  }

  if (!formData.value.category) {
    errors.value.category = 'Category is required';
  }

  if (!formData.value.quantity) {
    errors.value.quantity = 'Quantity is required';
  } else if (parseInt(formData.value.quantity) < 0) {
    errors.value.quantity = 'Quantity cannot be negative';
  }

  if (!formData.value.price) {
    errors.value.price = 'Price is required';
  } else if (parseFloat(formData.value.price) <= 0) {
    errors.value.price = 'Price must be greater than 0';
  }

  return Object.keys(errors.value).length === 0;
};

const handlePriceInput = (event) => {
  let value = event.target.value;
  value = value.replace(/-/g, '');
  if (parseFloat(value) < 0) {
    value = '0';
  }
  formData.value.price = value;
};

const handleQuantityInput = (event) => {
  let value = event.target.value;
  value = value.replace(/-/g, '');
  if (parseInt(value) < 0) {
    value = '0';
  }
  formData.value.quantity = value;
};

const closeModal = () => {
  emit('update:modelValue', false);
  errors.value = {};
};

const handleSubmit = () => {
  if (validateForm()) {
    const updatedProduct = {
      ...formData.value,
      quantity: parseInt(formData.value.quantity),
      price: parseFloat(formData.value.price),
      status: parseInt(formData.value.quantity) > 0 ? 'In Stock' : 'Out of Stock'
    };
    
    store.updateProduct(updatedProduct);
    closeModal();
  }
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
  animation: modal-appear 0.3s ease-out;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
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

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.error {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.disabled-input {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.price-input {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #495057;
}

.price-input input {
  padding-left: 25px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
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

@media (max-width: 600px) {
  .modal-container {
    width: 95%;
    margin: 10px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
