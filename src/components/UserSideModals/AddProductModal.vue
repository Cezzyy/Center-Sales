<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useProductsStore } from '@/stores/productStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const store = useProductsStore();

const errors = ref({});
const formData = ref({
  name: "",
  sku: "",
  category: "",
  quantity: "",
  price: "",
});

// Generate random SKU on component mount
const generateSKU = () => {
  const prefix = 'PRD';
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

onMounted(() => {
  formData.value.sku = generateSKU();
});

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
  errors.value = {};
  formData.value = {
    name: "",
    sku: generateSKU(),
    category: "",
    quantity: "",
    price: "",
  };
  emit("update:modelValue", false);
};

const handleSubmit = () => {
  if (validateForm()) {
    // Create new product object
    const newProduct = {
      id: Date.now(), // Generate unique ID
      name: formData.value.name,
      sku: formData.value.sku,
      category: formData.value.category,
      quantity: parseInt(formData.value.quantity),
      price: parseFloat(formData.value.price),
      status: parseInt(formData.value.quantity) > 0 ? 'In Stock' : 'Out of Stock'
    };

    // Add product to store
    store.addProduct(newProduct);
    
    // Close modal and reset form
    closeModal();
  }
};
</script>

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
          <input 
            type="text" 
            v-model="formData.name" 
            :class="{ 'error': errors.name }"
            placeholder="Enter product name"
          />
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label>SKU (Auto-generated)</label>
          <input type="text" v-model="formData.sku" disabled class="disabled-input" />
        </div>

        <div class="form-group">
          <label>Category</label>
          <select 
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
          <label>Quantity</label>
          <input 
            type="number" 
            v-model="formData.quantity" 
            min="0"
            @input="handleQuantityInput"
            onkeypress="return event.charCode >= 48"
            :class="{ 'error': errors.quantity }"
          />
          <span class="error-message" v-if="errors.quantity">{{ errors.quantity }}</span>
        </div>

        <div class="form-group">
          <label>Price (PHP)</label>
          <div class="price-input" :class="{ 'error': errors.price }">
            <span class="currency-symbol">₱</span>
            <input 
              type="number" 
              v-model="formData.price" 
              step="0.01" 
              min="0"
              @input="handlePriceInput"
              onkeypress="return event.charCode >= 48"
              placeholder="0.00"
            />
          </div>
          <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
          <button type="submit" class="btn-submit">Add Product</button>
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
  color: #495057;
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
