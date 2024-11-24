<script setup>
import { reactive } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  // Handle form submission logic here
  console.log('Form submitted:', formData)
}
</script>

<template>
  <div class="contact-container">
    <!-- Header Section -->
    <header class="contact-header">
      <h1>Contact Us</h1>
      <p>Get in touch with our team for any inquiries or support</p>
    </header>

    <router-link to="/" class="back-button">
    ← Back
    </router-link>

    <!-- Main Content -->
    <main class="contact-content">
      <!-- Contact Information Section -->
      <section class="contact-info">
        <h2>Contact Information</h2>
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon">📞</div>
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon - Fri, 9:00 AM - 6:00 PM</p>
          </div>
          <div class="info-card">
            <div class="info-icon">✉️</div>
            <h3>Email</h3>
            <p>support@scms.com</p>
            <p>sales@scms.com</p>
          </div>
          <div class="info-card">
            <div class="info-icon">📍</div>
            <h3>Location</h3>
            <p>123 Business Avenue</p>
            <p>New York, NY 10001</p>
          </div>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section class="contact-form-section">
        <div class="form-container">
          <h2>Send us a Message</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                placeholder="Enter your full name"
              >
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Enter your email"
              >
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input
                type="text"
                id="subject"
                v-model="formData.subject"
                required
                placeholder="Enter message subject"
              >
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                placeholder="Enter your message"
                rows="5"
              ></textarea>
            </div>

            <button type="submit" class="submit-button">Send Message</button>
          </form>
        </div>
      </section>

      <!-- Map Section -->
      <section class="map-section">
        <h2>Our Location</h2>
        <div class="map-container">
          <!-- Placeholder for map -->
          <div class="map-placeholder">
            <p>Interactive Map</p>
            <p class="map-text">123 Business Avenue, New York, NY 10001</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Base Styles */
body {
  background-color: #f8f9fa;
}

/* Container */
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header Styles */
.contact-header {
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.contact-header h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.contact-header p {
  color: #6b7280;
  font-size: 1.1rem;
}

/* Contact Information Section */
.contact-info {
  margin-bottom: 4rem;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.info-card p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

/* Form Section */
.contact-form-section {
  margin-bottom: 4rem;
}

.form-container {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-container h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

textarea {
  resize: vertical;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

/* Map Section */
.map-section {
  margin-bottom: 2rem;
}

.map-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6b7280;
  font-size: 1.2rem;
}

.map-text {
  font-size: 1rem;
  margin-top: 0.5rem;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
}

.back-button:hover {
  background-color: #1d4ed8;
  transform: translateX(-5px);
}
.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
}

.back-button:hover {
  background-color: #1d4ed8;
  transform: translateX(-5px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-container {
    padding: 1rem;
  }

  .contact-header {
    padding: 2rem 1rem;
  }

  .contact-header h1 {
    font-size: 2rem;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .form-container {
    padding: 1.5rem;
  }

  .map-container {
    height: 300px;
  }
  .back-button {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  .back-button {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
