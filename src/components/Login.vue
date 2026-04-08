<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.stores'

const email = ref('')
const error = ref('')
const router = useRouter()
const store = useUserStore()

const handleLogin = () => {
  error.value = ''
  
  if (email.value === 'toto') {
    store.isAuthenticated = true
    router.push('/hello')
  } else {
    error.value = 'Invalid email. Please enter "toto"'
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}

const togglePermission = () => {
  store.isAuthenticated = true
  error.value = ''
  router.push('/hello')
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Login</h1>
      
      <div class="form-group">
        <label for="email">Email address:</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          @keypress="handleKeyPress"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button @click="handleLogin" class="login-button">
        Login
      </button>

      <div class="permission-section">
        <p class="permission-status">
          Permission: <strong :class="store.isAuthenticated ? 'granted' : 'denied'">
            {{ store.isAuthenticated ? '✓ Enabled' : '✗ Disabled' }}
          </strong>
        </p>
        <button @click="togglePermission" class="toggle-button" :class="{ active: store.isAuthenticated }">
          {{ store.isAuthenticated ? 'Disable' : 'Enable' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #dc3545;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8d7da;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.permission-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.permission-status {
  text-align: center;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.permission-status strong.granted {
  color: #28a745;
  font-weight: bold;
}

.permission-status strong.denied {
  color: #dc3545;
  font-weight: bold;
}

.toggle-button {
  width: 100%;
  padding: 10px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.toggle-button:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.toggle-button.active {
  background-color: #28a745;
}

.toggle-button.active:hover {
  background-color: #218838;
}
</style>
