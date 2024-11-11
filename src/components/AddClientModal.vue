<template>
  <div>
    <!-- Modal Overlay -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn">&times;</button>

        <h2>Add New Client</h2>

        <form @submit.prevent="handleSubmit" class="client-form">
          <!-- Profile Picture Section -->
          <div class="profile-picture-section">
            <label>Profile Picture</label>
            <div class="profile-upload">
              <input type="file" @change="handleImageUpload" accept="image/*" ref="fileInput" />
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Profile Preview" />
              </div>
            </div>
          </div>

          <!-- Client Information Fields -->
          <div class="form-group">
            <label>First Name</label>
            <input type="text" v-model="formData.firstName" required />
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input type="text" v-model="formData.lastName" required />
          </div>

          <div class="form-group">
            <label>Address</label>
            <textarea v-model="formData.address" required></textarea>
          </div>

          <div class="form-group">
            <label>Company</label>
            <input type="text" v-model="formData.company" required />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" v-model="formData.email" required />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="formData.phone" required />
          </div>

          <button type="submit" class="add-btn">Add Client</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue'

const { isModalOpen } = defineProps({
  isModalOpen: Boolean,
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const imagePreview = ref(null)
const fileInput = ref(null)

// Form data with initial empty values
const formData = reactive({
  firstName: '',
  lastName: '',
  address: '',
  company: '',
  email: '',
  phone: '',
  profilePicture: null,
})

// Function to handle image upload and preview
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.profilePicture = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Handle form submission and reset the form after submission
const handleSubmit = () => {
  console.log('Form submitted:', formData)
  closeModal()

  Object.keys(formData).forEach((key) => (formData[key] = ''))
  imagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}
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

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

.client-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview {
  width: 150px;
  height: 150px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.open-modal-btn,
.add-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.open-modal-btn:hover,
.add-btn:hover {
  background-color: #45a049;
}

.add-btn {
  margin-top: 1rem;
}

/* Form validation styles */
input:invalid,
textarea:invalid {
  border-color: #ff4444;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 1rem;
  }
}
</style>
