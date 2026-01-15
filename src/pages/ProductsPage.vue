<template>
  <v-table striped="even">
      <thead class="bg-deep-purple-accent-4 text-white">
      <tr>
        <th class="text-left">
          Code
        </th>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Description
        </th>
        <th class="text-left">
          Category
        </th>
        <th class="text-left">
            Reorder Level
        </th>
        <th class ="text-left">
            Saftey Stock
        </th>
        <th class="text-left">
            Unit
        </th>
        <th class="text-left">
            Actions
        </th>

      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in desserts"
        :key="item.name"
      >
        <td>{{ item.code }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.category }}</td>
        <td>{{ item.reorder_level }}</td>
        <td>{{ item.safety_stock }}</td>
        <td>{{ item.unit }}</td>
        <td>
          <v-btn icon="mdi-pencil" variant="text" class="text-deep-purple-lighten-4"/>
          <v-btn icon="mdi-delete" variant="text" class="text-red"/>
          <v-btn icon="mdi-information" variant="text" class="text-blue" @click="fetchProduct(item.id)"/>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script setup>
  import { onMounted, ref } from 'vue'
  import api from '@/plugins/api.js'


   const desserts = ref([])


async function fetchProducts() {
    try {
      const response = await api.get('/products')
      desserts.value = response.data
      //console.log('Products data:', response.data)
    } catch (error) {
      console.error('Error fetching products data:', error)
    }
  }

async function fetchProduct(product_id){
  try{
    const response = await api.get(`/products/${product_id}`)
    console.log('Product data:', response.data)
    return response.data

  }catch(error){
    console.error('Error fetching product data:', error)
  }
}

  onMounted(() => {
    fetchProducts()
  })

 
</script>