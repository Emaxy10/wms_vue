<template>
  <v-container>
    <v-card elevation="2">
      <v-card-title class="text-h6">Create Product</v-card-title>
      <v-divider />

      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-row>
            <!-- Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Product Name"
                :error="v$.name.$error"
                :error-messages="v$.name.$errors.map(e => e.$message)"
                required
              />
            </v-col>

            <!-- Category -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.category"
                :items="categories"
                label="Category"
                :error="v$.category.$error"
                :error-messages="v$.category.$errors.map(e => e.$message)"
                required
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                rows="3"
                :error="v$.description.$error"
                :error-messages="v$.description.$errors.map(e => e.$message)"
              />
            </v-col>

            <!-- Reorder Level -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.reorder_level"
                label="Reorder Level"
                type="number"
                min="0"
                :error="v$.reorder_level.$error"
                :error-messages="v$.reorder_level.$errors.map(e => e.$message)"
              />
            </v-col>

            <!-- Safety Stock -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.safety_stock"
                label="Safety Stock"
                type="number"
                min="0"
                :error="v$.safety_stock.$error"
                :error-messages="v$.safety_stock.$errors.map(e => e.$message)"
              />
            </v-col>

            <!-- Unit -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.unit"
                :items="units"
                label="Unit"
                :error="v$.unit.$error"
                :error-messages="v$.unit.$errors.map(e => e.$message)"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-card-actions class="justify-end">
            <v-btn variant="outlined" color="grey" @click="resetForm">
              Reset
            </v-btn>
            <v-btn color="deep-purple-accent-4" type="submit">
              Create Product
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import api from '@/plugins/api.js'

const form = ref({
  name: '',
  description: '',
  category: '',
  reorder_level: null,
  safety_stock: null,
  unit: '',
})

const categories = ['Raw Material', 'Finished Goods', 'Consumables']
const units = ['kg', 'Ltrs']

// Validation rules
const rules = {
  name: { required },
  description: { required },
  category: { required },
  reorder_level: { required, minValue: minValue(0) },
  safety_stock: { required, minValue: minValue(0) },
  unit: { required },
}

// Initialize Vuelidate
const v$ = useVuelidate(rules, form)

const submitForm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    console.log('Form is invalid')
    return
  }

  const productData = { ...form.value }
  try {
    const response = await api.post('/product/create', productData)
    console.log('Product created successfully:', response.data)
    resetForm()
  } catch (error) {
    console.error('Error creating product:', error)
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    category: '',
    reorder_level: null,
    safety_stock: null,
    unit: '',
  }
  v$.value.$reset()
}
</script>
