<script setup>
import { ref } from 'vue'

// Props and Emits
const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['close'])

// State
const previewImage = ref(null)
const formData = ref({
  firstName: '',
  lastName: '',
  address: '',
  company: '',
  email: '',
  phone: '',
  profilePicture: null,
})

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
      formData.value.profilePicture = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = () => {
  console.log('Form submitted:', formData.value)
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    address: '',
    company: '',
    email: '',
    phone: '',
    profilePicture: null,
  }
  previewImage.value = null
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" v-if="isModalOpen" @click.self="closeModal">
    <div class="modal-content">
      <h2>Add New Client</h2>

      <form @submit.prevent="handleSubmit" class="edit-form">
        <!-- Profile Picture Section -->
        <div class="profile-picture-section">
          <div class="preview-container">
            <img
              :src="previewImage || '/default-avatar.png'"
              alt="Profile Preview"
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
          </div>
        </div>

        <!-- Form Fields -->
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            required
          />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            required
          />
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            v-model="formData.address"
            required
          />
        </div>

        <div class="form-group">
          <label for="company">Company</label>
          <input
            type="text"
            id="company"
            v-model="formData.company"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            required
          />
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button type="button" class="cancel-btn" @click="closeModal">
            Cancel
          </button>
          <button type="submit" class="done-btn">
            Add Client
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

h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  text-align: center;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.preview-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e0e0e0;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-button input[type="file"] {
  display: none;
}

.custom-file-upload {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-file-upload:hover {
  background-color: #e0e0e0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #555;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

button:hover {
  opacity: 0.9;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.done-btn {
  background-color: #4a90e2;
  color: white;
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1rem;
  }

  .button-group {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}

</style>
