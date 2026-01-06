<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-card
        elevation="8"
        rounded="xl"
        class="pa-8"
        max-width="420"
        width="100%"
      >
        <v-card-title class="text-h5 text-center font-weight-medium">
          Welcome Back
        </v-card-title>

        <v-card-subtitle class="text-center mb-6">
          Login to continue
        </v-card-subtitle>

        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            class="mt-4"
          >
            Login
          </v-btn>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/api.js'

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  api.get('/sanctum/csrf-cookie').then(() => {
    api
      .post('/login', {
        email: email.value,
        password: password.value,
      })
      .then(() => {
        router.push({ name: 'Dashboard' })
      })
      .catch((error) => {
        console.error('Login error:', error)
        alert('Login failed. Please check your credentials.')
      })
  })
}
</script>
