<script setup>
import { ref, watch } from 'vue'
import defaultProfilePic from '@/assets/defaultprofile.png'

// Props and Emits
const props = defineProps({
  isOpen: Boolean,
  client: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['close', 'submit'])

// Form state
const formData = ref({
  id: '',
  firstName: '',
  lastName: '',
  address: '',
  company: '',
  email: '',
  phone: '',
  profilePicture: defaultProfilePic, // Always use default picture
})

// Watch for client prop changes
watch(
  () => props.client,
  (newClient) => {
    if (newClient) {
      formData.value = {
        ...newClient,
        profilePicture: defaultProfilePic, // Always use default picture
      }
    }
  },
  { immediate: true },
)

// Validation state
const errors = ref({})
const touched = ref({})

// Validation rules
const rules = {
  firstName: (value) => {
    if (!value) return 'First name is required'
    if (value.length < 2) return 'First name must be at least 2 characters'
    return null
  },
  lastName: (value) => {
    if (!value) return 'Last name is required'
    if (value.length < 2) return 'Last name must be at least 2 characters'
    return null
  },
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return null
  },
  phone: (value) => {
    if (!value) return 'Phone number is required'
    const phoneRegex = /^(?:\+63|0)(?:9\d{9})$/
    const cleanedNumber = value.replace(/\s+/g, '')
    if (!phoneRegex.test(cleanedNumber)) return 'Please enter a valid Philippine phone number'
    return null
  },
  address: (value) => {
    if (!value) return 'Address is required'
    return null
  },
  company: (value) => {
    if (!value) return 'Company is required'
    return null
  },
}

// Validation methods
const validateField = (field) => {
  if (!rules[field]) return
  const value = formData.value[field]
  errors.value[field] = rules[field](value)
  touched.value[field] = true
}

const validateForm = () => {
  Object.keys(rules).forEach(validateField)
  return !Object.values(errors.value).some(Boolean)
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...formData.value })
    closeModal()
  }
}

const closeModal = () => {
  errors.value = {}
  touched.value = {}
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Edit Client</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <!-- Profile Picture Preview (Static) -->
        <div class="profile-section">
          <div class="profile-preview">
            <img :src="defaultProfilePic" alt="Default Profile" class="preview-image" />
          </div>
          <p class="profile-text">Default Profile Picture</p>
        </div>

        <!-- Form Fields -->
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName">First Name<span class="required">*</span></label>
            <input
              id="firstName"
              v-model="formData.firstName"
              @blur="validateField('firstName')"
              :class="{ error: touched.firstName && errors.firstName }"
              type="text"
              placeholder="Enter first name"
            />
            <span v-if="touched.firstName && errors.firstName" class="error-message">{{
              errors.firstName
            }}</span>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name<span class="required">*</span></label>
            <input
              id="lastName"
              v-model="formData.lastName"
              @blur="validateField('lastName')"
              :class="{ error: touched.lastName && errors.lastName }"
              type="text"
              placeholder="Enter last name"
            />
            <span v-if="touched.lastName && errors.lastName" class="error-message">{{
              errors.lastName
            }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email<span class="required">*</span></label>
            <input
              id="email"
              v-model="formData.email"
              @blur="validateField('email')"
              :class="{ error: touched.email && errors.email }"
              type="email"
              placeholder="Enter email address"
            />
            <span v-if="touched.email && errors.email" class="error-message">{{
              errors.email
            }}</span>
          </div>

          <div class="form-group">
            <label for="phone">Phone<span class="required">*</span></label>
            <input
              id="phone"
              v-model="formData.phone"
              @blur="validateField('phone')"
              :class="{ error: touched.phone && errors.phone }"
              type="tel"
              placeholder="+63 or 09 followed by 9 digits"
            />
            <span v-if="touched.phone && errors.phone" class="error-message">{{
              errors.phone
            }}</span>
          </div>

          <div class="form-group">
            <label for="company">Company<span class="required">*</span></label>
            <input
              id="company"
              v-model="formData.company"
              @blur="validateField('company')"
              :class="{ error: touched.company && errors.company }"
              type="text"
              placeholder="Enter company name"
            />
            <span v-if="touched.company && errors.company" class="error-message">{{
              errors.company
            }}</span>
          </div>

          <div class="form-group">
            <label for="address">Address<span class="required">*</span></label>
            <input
              id="address"
              v-model="formData.address"
              @blur="validateField('address')"
              :class="{ error: touched.address && errors.address }"
              type="text"
              placeholder="Enter complete address"
            />
            <span v-if="touched.address && errors.address" class="error-message">{{
              errors.address
            }}</span>
          </div>
        </div>

        <div class="button-group">
          <button type="button" class="cancel-button" @click="closeModal">Cancel</button>
          <button type="submit" class="submit-button">
            <span class="button-text">Save Changes</span>
          </button>
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.profile-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e5e7eb;
  background-color: #f9fafb;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: #f9fafb;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: white;
}

.form-group input.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cancel-button {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  min-width: 120px;
}

.submit-button:hover {
  background-color: #2563eb;
}

.button-text {
  font-weight: 500;
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .button-group {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>
