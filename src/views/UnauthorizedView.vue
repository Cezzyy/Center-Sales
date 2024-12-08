<template>
  <div class="unauthorized">
    <div class="unauthorized__content">
      <h1 class="unauthorized__title">Access Denied</h1>
      <p class="unauthorized__message">
        You don't have permission to access this page.
        Please contact your administrator if you believe this is an error.
      </p>
      <router-link to="/" class="unauthorized__button">
        Return to Home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.unauthorized {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.unauthorized__content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.unauthorized__title {
  color: #dc3545;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.unauthorized__message {
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.unauthorized__button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.unauthorized__button:hover {
  background-color: #0056b3;
}
</style>
