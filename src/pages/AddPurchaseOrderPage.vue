<template>
  <v-card elevation="2" class="mx-auto mt-4" max-width="1000">
    <v-card-title class="text-h6">
      Add Purchase Order
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-form @submit.prevent="handleSubmit">

        <v-row>

          <!-- Product -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.product_id"
              :items="products"
              item-title="name"
              item-value="id"
              label="Select Product"
              variant="outlined"
              required
            />
          </v-col>

          <!-- Client -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.client_id"
              :items="clients"
              item-title="name"
              item-value="id"
              label="Select Client"
              variant="outlined"
              required
            />
          </v-col>

          <!-- Warehouse -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.warehouse_id"
              :items="warehouses"
              item-title="name"
              item-value="id"
              label="Select Warehouse"
              variant="outlined"
              required
            />
          </v-col>

          <!-- Quantity -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.quantity_ordered"
              label="Quantity Ordered"
              type="number"
              min="1"
              variant="outlined"
              required
            />
          </v-col>

          <!-- Unit of Measure -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.unit_of_measure"
              label="Unit of Measure (e.g. pcs, kg)"
              variant="outlined"
              required
            />
          </v-col>

          <!-- Status -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.status"
              :items="['PENDING','RECEIVED','CANCELLED']"
              label="Status"
              variant="outlined"
              required
            />
          </v-col>

          <!-- Order Date -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.order_date"
              label="Order Date"
              type="date"
              variant="outlined"
              required
            />
          </v-col>

          <!-- Expected Delivery Date -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.expected_delivery_date"
              label="Expected Delivery Date"
              type="date"
              variant="outlined"
              required
            />
          </v-col>

          <!-- File Upload -->
          <v-col cols="12">
            <v-file-input
              label="Attach File (optional)"
              variant="outlined"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
              show-size
              @change="handleFile"
            />
          </v-col>

        </v-row>

        <v-divider class="my-4" />

        <v-card-actions class="justify-end">
          <v-btn color="grey" variant="outlined">
            Cancel
          </v-btn>

          <v-btn type="submit" color="primary">
            Submit Purchase Order
          </v-btn>
        </v-card-actions>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

/* Form Data */
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

/* Dropdown Data */
const products = ref([])
const clients = ref([])
const warehouses = ref([])

/* Fetch Data */
const fetchProducts = async () => {
  try {
    const res = await axios.get('/api/products')
    products.value = res.data
  } catch (error) {
    console.error('Error fetching products', error)
  }
}

const fetchClients = async () => {
  try {
    const res = await axios.get('/api/clients')
    clients.value = res.data
  } catch (error) {
    console.error('Error fetching clients', error)
  }
}

const fetchWarehouses = async () => {
  try {
    const res = await axios.get('/api/warehouses')
    warehouses.value = res.data
  } catch (error) {
    console.error('Error fetching warehouses', error)
  }
}

/* Handle File Upload */
const handleFile = (file) => {
  form.file = file
}

/* Submit Form */
const handleSubmit = async () => {
  try {

    const formData = new FormData()

    formData.append('product_id', form.product_id)
    formData.append('client_id', form.client_id)
    formData.append('warehouse_id', form.warehouse_id)
    formData.append('quantity_ordered', form.quantity_ordered)
    formData.append('status', form.status)
    formData.append('order_date', form.order_date)
    formData.append('expected_delivery_date', form.expected_delivery_date)
    formData.append('unit_of_measure', form.unit_of_measure)

    if (form.file) {
      formData.append('file', form.file)
    }

    await axios.post('/api/purchase-orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    alert('Purchase Order Created Successfully')

  } catch (error) {
    console.error('Error creating purchase order', error.response?.data)
  }
}

/* Load dropdown data */
onMounted(() => {
  fetchProducts()
  fetchClients()
  fetchWarehouses()
})
</script>