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


   <!-- PRODUCT INFO MODAL -->
<v-dialog v-model="showDialog" max-width="750">
  <v-card>
    <!-- Header -->
    <v-card-title class="bg-deep-purple-accent-4 text-white">
      <v-icon start>mdi-package-variant</v-icon>
      Product Details
    </v-card-title>

    <v-card-text v-if="selectedProduct">
      <!-- PRODUCT SUMMARY -->
      <v-row dense>
        <v-col cols="6">
          <strong>Code:</strong> {{ selectedProduct.code }}
        </v-col>
        <v-col cols="6">
          <strong>Name:</strong> {{ selectedProduct.name }}
        </v-col>

        <v-col cols="6">
          <strong>Category:</strong> {{ selectedProduct.category }}
        </v-col>
        <v-col cols="6">
          <strong>Unit:</strong> {{ selectedProduct.unit }}
        </v-col>

        <v-col cols="6">
          <strong>Reorder Level:</strong> {{ selectedProduct.reorder_level }}
        </v-col>
        <v-col cols="6">
          <strong>Safety Stock:</strong> {{ selectedProduct.safety_stock }}
        </v-col>

        <v-col cols="12">
        <strong>Total Stock:</strong> {{ totalQuantity }}
      </v-col>
      </v-row>

      


      <v-divider class="my-4" />

      <!-- WAREHOUSE STOCK TABLE -->
      <h4 class="text-subtitle-1 font-weight-bold mb-2">
        Warehouse Stock
      </h4>

      <v-table density="compact">
        <thead class="bg-grey-lighten-3">
          <tr>
            <th>Warehouse</th>
            <th>Location</th>
            <th class="text-right">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="wh in selectedProduct.warehouses"
            :key="wh.id"
          >
            <td>{{ wh.name }}</td>
            <td>{{ wh.location }}</td>
            <td class="text-right">
              <v-chip
                :color="wh.quantity <= selectedProduct.safety_stock ? 'red' : 'green'"
                size="small"
              >
                {{ wh.quantity }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>

    <!-- Footer -->
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" color="red" @click="showDialog = false">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>
<script setup>
  import { onMounted, ref , computed} from 'vue'
  import api from '@/plugins/api.js'


   const desserts = ref([])
    const showDialog = ref(false)
    const selectedProduct = ref(null)


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
    selectedProduct.value = response.data
    showDialog.value = true
    console.log('Product data:', response.data)
    return response.data

  }catch(error){
    console.error('Error fetching product data:', error)
  }
}

const totalQuantity = computed(() =>
  selectedProduct.value?.warehouses.reduce(
    (sum, w) => sum + w.quantity,
    0
  )
)

  onMounted(() => {
    fetchProducts()
  })

 
</script>