<template>
  <v-card max-width="700" class="mx-auto mt-6">
    <v-card-title>Create User</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submitForm">

        <v-row>

          <!-- NAME -->
          <v-col cols="12">
            <v-text-field
              label="Name"
              v-model="form.name"
              :error-messages="v$.name.$errors.map(e => e.$message)"
            />
          </v-col>

          <!-- EMAIL -->
          <v-col cols="12">
            <v-text-field
              label="Email"
              v-model="form.email"
              :error-messages="v$.email.$errors.map(e => e.$message)"
            />
          </v-col>

          <!-- WAREHOUSE -->
          <v-col cols="12">
            <v-select
              label="Warehouse"
              :items="warehouses"
              item-title="name"
              item-value="id"
              v-model="form.warehouse_id"
              :error-messages="v$.warehouse_id.$errors.map(e => e.$message)"
            />
          </v-col>

          <!-- PASSWORD -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Password"
              type="password"
              v-model="form.password"
              :error-messages="v$.password.$errors.map(e => e.$message)"
            />
          </v-col>

          <!-- CONFIRM PASSWORD -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Confirm Password"
              type="password"
              v-model="form.password_confirmation"
              :error-messages="v$.password_confirmation.$errors.map(e => e.$message)"
            />
          </v-col>

        </v-row>

        <v-btn type="submit" color="primary" class="mt-4">
          Create User
        </v-btn>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, helpers, sameAs } from '@vuelidate/validators'
import api from '@/plugins/api.js'

// FORM
const form = ref({
  name: '',
  email: '',
  warehouse_id: null,
  password: '',
  password_confirmation: ''
})

// WAREHOUSES
const warehouses = ref([])

async function fetchWarehouses() {
  const res = await api.get('/warehouses')
  warehouses.value = res.data
}

// PASSWORD RULES
const hasUppercase = helpers.withMessage(
  'Must contain uppercase letter',
  value => /[A-Z]/.test(value)
)

const hasLowercase = helpers.withMessage(
  'Must contain lowercase letter',
  value => /[a-z]/.test(value)
)

const hasNumber = helpers.withMessage(
  'Must contain a number',
  value => /[0-9]/.test(value)
)

const hasSymbol = helpers.withMessage(
  'Must contain a special character',
  value => /[^A-Za-z0-9]/.test(value)
)

// VALIDATIONS
const rules = computed(() => ({
  name: {
    required: helpers.withMessage('Name is required', required)
  },

  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Invalid email', email)
  },

  warehouse_id: {
    required: helpers.withMessage('Warehouse is required', required)
  },

  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Min 8 characters', minLength(8)),
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol
  },

  password_confirmation: {
    required: helpers.withMessage('Confirm your password', required),
    sameAsPassword: helpers.withMessage(
      'Passwords do not match',
      sameAs(form.value.password)
    )
  }
}))

const v$ = useVuelidate(rules, form)

// SUBMIT
async function submitForm() {
  v$.value.$touch()

  if (v$.value.$invalid) return

  try {
    await api.post('/users/create', form.value)

    alert('User created successfully')

    // reset form
    form.value = {
      name: '',
      email: '',
      warehouse_id: null,
      password: '',
      password_confirmation: ''
    }

    v$.value.$reset()

  } catch (err) {
    console.error(err)
    alert('Error creating user')
  }
}

onMounted(fetchWarehouses)
</script>