<template>
  <v-card>
    <v-card-title>Add Purchase Order</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        
        <!-- Product -->
        <v-select
          v-model="form.product_id"
          :items="products"
          item-title="name"
          item-value="id"
          label="Select Product"
          variant="outlined"
          required
        />

        <!-- Client -->
        <v-select
          v-model="form.client_id"
          :items="clients"
          item-title="name"
          item-value="id"
          label="Select Client"
          variant="outlined"
          required
        />

        <!-- Warehouse -->
        <v-select
          v-model="form.warehouse_id"
          :items="warehouses"
          item-title="name"
          item-value="id"
          label="Select Warehouse"
          variant="outlined"
          required
        />

        <!-- Quantity -->
        <v-text-field
          v-model="form.quantity_ordered"
          label="Quantity Ordered"
          type="number"
          variant="outlined"
          required
        />

        <!-- Unit of Measure -->
        <v-text-field
          v-model="form.unit_of_measure"
          label="Unit of Measure (e.g. pcs, kg)"
          variant="outlined"
          required
        />

        <!-- Status -->
        <v-select
          v-model="form.status"
          :items="['PENDING','RECEIVED','CANCELLED']"
          label="Status"
          variant="outlined"
          required
        />

        <!-- Order Date -->
        <v-text-field
          v-model="form.order_date"
          label="Order Date"
          type="date"
          variant="outlined"
          required
        />

        <!-- Expected Delivery Date -->
        <v-text-field
          v-model="form.expected_delivery_date"
          label="Expected Delivery Date"
          type="date"
          variant="outlined"
          required
        />

        <!-- File Upload -->
        <v-file-input
          v-model="form.file"
          label="Attach File (optional)"
          variant="outlined"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
        />

        <v-btn type="submit" color="primary" class="mt-4">
          Submit
        </v-btn>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { reactive } from 'vue'
import axios from 'axios'

const form = reactive({
  product_id: null,
  client_id: null,
  warehouse_id: null,
  quantity_ordered: null,
  status: 'PENDING',
  order_date: '',
  expected_delivery_date: '',
  unit_of_measure: '',
  file: null,
})

/* Replace with API calls */
const products = []
const clients = []
const warehouses = []

const handleSubmit = async () => {
  try {
    const formData = new FormData()

    for (let key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key])
      }
    }

    await axios.post('/api/purchase-orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    alert('Purchase Order Created Successfully')
  } catch (error) {
    console.error(error.response?.data)
  }
}
</script>