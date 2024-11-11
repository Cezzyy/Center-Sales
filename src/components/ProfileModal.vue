<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
    default: () => ({
      firstName: '',
      lastName: '',
      position: '',
      email: '',
      phoneNumber: '',
      profilePicture: '',
    }),
  },
})

const emit = defineEmits(['close', 'editProfile'])

const handleClose = () => {
  emit('close')
}

const handleEditProfile = () => {
  emit('editProfile')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-container">
      <button class="close-button" @click="handleClose">×</button>

      <div class="modal-content">
        <!-- Left Side - Profile Picture -->
        <div class="profile-picture-section">
          <img :src="userData.profilePicture" alt="Profile Picture" class="profile-picture" />
        </div>

        <!-- Right Side - Profile Information -->
        <div class="profile-info-section">
          <div class="info-group">
            <label>First Name</label>
            <p>{{ userData.firstName }}</p>
          </div>

          <div class="info-group">
            <label>Last Name</label>
            <p>{{ userData.lastName }}</p>
          </div>

          <div class="info-group">
            <label>Company Position</label>
            <p>{{ userData.position }}</p>
          </div>

          <div class="info-group">
            <label>Email Address</label>
            <p>{{ userData.email }}</p>
          </div>

          <div class="info-group">
            <label>Phone Number</label>
            <p>{{ userData.phoneNumber }}</p>
          </div>

          <button class="edit-button" @click="handleEditProfile">Edit Profile Information</button>
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
  padding: 24px;
  width: 800px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
}

.close-button:hover {
  color: #333;
}

.modal-content {
  display: flex;
  gap: 24px;
}

.profile-picture-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

.profile-info-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-group label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-group p {
  font-size: 16px;
  color: #333;
  margin: 0;
  padding: 4px 0;
}

.edit-button {
  margin-top: 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #357abd;
}
</style>
