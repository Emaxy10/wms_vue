<template>
  <v-card max-width="600" class="mx-auto">
    <v-card-title class="bg-deep-purple-accent-4 text-white">
      <v-icon start>mdi-swap-horizontal</v-icon>
      Stock Movement
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submitForm" ref="formRef">
        <!-- PRODUCT -->
        <v-select
          v-model="form.product_id"
          :items="products"
          item-title="name"
          item-value="id"
          label="Product"
          :rules="[v => !!v || 'Product is required']"
          required
        />

        <!-- WAREHOUSE -->
        <v-select
          v-model="form.location"
          :items="warehouses"
          item-title="name"
          item-value="id"
          label="Warehouse"
          :rules="[v => !!v || 'Warehouse is required']"
          required
        />

        <!-- MOVEMENT TYPE -->
        <v-select
          v-model="form.type"
          :items="movementTypes"
          label="Movement Type"
          :rules="[v => !!v || 'Type is required']"
          required
        />

        <!-- QUANTITY -->
        <v-text-field
          v-model.number="form.quantity"
          type="number"
          min="1"
          label="Quantity"
          :rules="[v => v > 0 || 'Quantity must be at least 1']"
          required
        />

        <!-- REASON -->
        <v-text-field
          v-model="form.reason"
          label="Reason (optional)"
          maxlength="255"
        />

        <v-btn
          type="submit"
          color="deep-purple"
          block
          class="mt-4"
          :loading="loading"
        >
          Submit Movement
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>





<script setup>

import { onMounted, ref , computed} from 'vue'
import api from '@/plugins/api.js'


const warehouses = ref([])
const products = ref([null])

const formRef = ref(null)
const loading = ref(false)

const movementTypes = [
  { title: 'Stock In', value: 'in' },
  { title: 'Stock Out', value: 'out' },
  { title: 'Adjustment', value: 'adjustment' },
]


const form = ref({
  product_id: null,
  quantity: null,
  location: null,
  type: null,
  reason: null,
})

async function fetchProducts(){
  try{
    const response = await api.get(`/products`)
    products.value = response.data
    console.log('Product da${product_id}ta:', response.data)
    return response.data

  }catch(error){
    console.error('Error fetching product data:', error)
  }
}

async function fetchWarehouses(){
  try{
    const response = await api.get(`/warehouses`)
    warehouses.value = response.data
    console.log('Warehouse data:', response.data)
    return response.data

  }catch(error){
    console.error('Error fetching warehouse data:', error)
  }
}

async function submitForm(){
  loading.value = true
  try{
    const response = await api.post('/stock-movement/create', form.value)
    console.log('Stock movement created successfully:', response.data)
    // Reset form
    form.value = {
      product_id: null,
      quantity: null,
      location: null,
      type: null,
      reason: null,
    }
    formRef.value.resetValidation()
  }catch(error){
    console.error('Error creating stock movement:', error)
  }finally{
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchWarehouses()
})
</script>