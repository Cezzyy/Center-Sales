<script setup>
import { ref, onMounted } from 'vue'
import defaultProfilePic from '@/assets/defaultprofile.png'
import { useClientStore } from '@/stores/clientStore'

// Initialize store
const store = useClientStore()

// Props definition
const props = defineProps({
  clientData: {
    type: Object,
    required: true,
    default: () => ({
      firstName: '',
      lastName: '',
      address: '',
      company: '',
      email: '',
      phone: '',
      profilePicture: defaultProfilePic
    })
  }
})

// Emits definition
const emit = defineEmits(['close'])

// Form state
const previewImage = ref(props.clientData.profilePicture || defaultProfilePic)
const formData = ref({...props.clientData})

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
    // Philippine phone number format: +63 followed by 10 digits
    // Accepts formats: +63XXXXXXXXXX, +63 XXXXXXXXXX, 09XXXXXXXXX
    const phoneRegex = /^(?:\+63|0)(?:9\d{9})$/
    const cleanedNumber = value.replace(/\s+/g, '')
    
    if (!phoneRegex.test(cleanedNumber)) {
      return 'Please enter a valid Philippine phone number (+63/09XXXXXXXXX)'
    }
    
    // Convert to standardized format if valid
    if (cleanedNumber.startsWith('0')) {
      formData.value.phone = '+63' + cleanedNumber.slice(1)
    }
    
    return null
  },
  address: (value) => {
    if (!value) return 'Address is required'
    if (value.length < 5) return 'Please enter a complete address'
    return null
  },
  company: (value) => {
    if (!value) return 'Company name is required'
    return null
  }
}

// Validation methods
const validateField = (field) => {
  const value = formData.value[field]
  const rule = rules[field]
  if (rule) {
    errors.value[field] = rule(value)
  }
  touched.value[field] = true
}

const validateForm = () => {
  Object.keys(rules).forEach(field => validateField(field))
  return Object.values(errors.value).every(error => error === null)
}

// Image handling
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5000000) {
      errors.value.profilePicture = 'Image must be less than 5MB'
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
      formData.value.profilePicture = e.target.result
      errors.value.profilePicture = null
    }
    reader.readAsDataURL(file)
  }
}

// Form submission
const handleSubmit = () => {
  if (validateForm()) {
    store.updateClient({ ...formData.value })
    emit('close')
  }
}

const closeModal = () => {
  emit('close')
}

// Initialize form when modal opens
onMounted(() => {
  formData.value = { ...props.clientData }
  previewImage.value = props.clientData.profilePicture || defaultProfilePic
  errors.value = {}
  touched.value = {}
})
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Edit Client</h2>

      <form @submit.prevent="handleSubmit" class="edit-form" novalidate>
        <!-- Profile Picture -->
        <div class="profile-picture-section">
          <div class="preview-container">
            <img
              :src="previewImage"
              :alt="`${formData.firstName || 'Default'} Profile Picture`"
              class="profile-preview"
            />
          </div>
          <div class="upload-button">
            <label for="profile-upload" class="custom-file-upload">
              Upload Picture
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              @change="handleImageUpload"
            />
            <span v-if="errors.profilePicture" class="error-message">
              {{ errors.profilePicture }}
            </span>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              v-model="formData.firstName"
              @blur="validateField('firstName')"
              :class="{ 'error': touched.firstName && errors.firstName }"
            />
            <span v-if="touched.firstName && errors.firstName" class="error-message">
              {{ errors.firstName }}
            </span>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              v-model="formData.lastName"
              @blur="validateField('lastName')"
              :class="{ 'error': touched.lastName && errors.lastName }"
            />
            <span v-if="touched.lastName && errors.lastName" class="error-message">
              {{ errors.lastName }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            @blur="validateField('email')"
            :class="{ 'error': touched.email && errors.email }"
          />
          <span v-if="touched.email && errors.email" class="error-message">
            {{ errors.email }}
          </span>
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            @blur="validateField('phone')"
            :class="{ 'error': touched.phone && errors.phone }"
            placeholder="+63 9XX XXX XXXX"
          />
          <span v-if="touched.phone && errors.phone" class="error-message">
            {{ errors.phone }}
          </span>
          <small class="helper-text">Format: +63 or 09 followed by 9 digits</small>
        </div>

        <div class="form-group">
          <label for="company">Company</label>
          <input
            type="text"
            id="company"
            v-model="formData.company"
            @blur="validateField('company')"
            :class="{ 'error': touched.company && errors.company }"
          />
          <span v-if="touched.company && errors.company" class="error-message">
            {{ errors.company }}
          </span>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            v-model="formData.address"
            @blur="validateField('address')"
            :class="{ 'error': touched.address && errors.address }"
          />
          <span v-if="touched.address && errors.address" class="error-message">
            {{ errors.address }}
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button type="button" class="cancel-btn" @click="closeModal">
            Cancel
          </button>
          <button type="submit" class="done-btn">
            Save Changes
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
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
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

.helper-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.preview-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.custom-file-upload {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.custom-file-upload:hover {
  background-color: #e5e7eb;
}

input[type="file"] {
  display: none;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn, .done-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
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

.done-btn {
  background-color: #3b82f6;
  color: white;
}

.done-btn:hover {
  background-color: #2563eb;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
  
  .modal-content {
    padding: 1rem;
  }
}
</style>
