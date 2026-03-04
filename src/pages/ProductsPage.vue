<template>
  <v-card>
    <v-card-title class="text-h6 d-flex align-center">
       <span class="text-h6">Product List</span>
      <v-spacer />
      <!-- //button should be at far right -->
      <v-btn color="primary" variant="outlined" :to="{ name: 'CreateProductPage' }">
        <v-icon start>mdi-plus</v-icon>
        Add Product
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text>
       <v-table striped="even" max-width="800" class="mx-auto">
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
          <v-btn icon="mdi-pencil" variant="text" class="text-deep-purple-lighten-4" @click="editProduct(item.id)"/>
          <v-btn icon="mdi-delete" variant="text" class="text-red" @click="deleteProduct(item.id)"/>
          <v-btn icon="mdi-information" variant="text" class="text-blue" @click="productInfo(item.id)"/>
        </td>
      </tr>
    </tbody>
  </v-table>
    </v-card-text>
      
  </v-card>
 


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

    <!-- PRODUCT EDIT MODAL -->
<v-dialog v-model="showEditDialog" max-width="600">
  <v-card>
    <v-card-title class="bg-deep-purple-accent-4 text-white">
      <v-icon start>mdi-pencil</v-icon>
      Edit Product
    </v-card-title>

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

           <!-- Average Daily Sales -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.average_daily_sales"
              label="Average Daily Sales"
              type="number"
              min="0"
              :error="v$.average_daily_sales.$error"
              :error-messages="v$.average_daily_sales.$errors.map(e => e.$message)"
              required
            />
          </v-col>

    <!-- Supplier Lead Time -->
    <v-col cols="12" md="6">
      <v-text-field
        v-model="form.supplier_lead_time"
        label="Supplier Lead Time (Days)"
        type="number"
        min="0"
        :error="v$.supplier_lead_time.$error"
        :error-messages="v$.supplier_lead_time.$errors.map(e => e.$message)"
        required
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
              <v-btn variant="text" color="red" @click="showEditDialog = false">
                Cancel
              </v-btn>
            <v-btn color="deep-purple-accent-4" type="submit">
              Update Product
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>

    </v-card> 
 </v-dialog>

</template>
<script setup>
  import { onMounted, ref , computed} from 'vue'
  import api from '@/plugins/api.js'
  import useVuelidate from '@vuelidate/core'
  import { required, minValue } from '@vuelidate/validators'


   const desserts = ref([])
    const showDialog = ref(false)
    const selectedProduct = ref(null)
    const showEditDialog = ref(false)
    const product_id = ref(null)



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
    console.log('Product data:', response.data)
    return response.data

  }catch(error){
    console.error('Error fetching product data:', error)
  }
}

const productInfo =(product_id) => {
  fetchProduct(product_id)
   showDialog.value = true
}

//Delete product function
async function deleteProduct(product_id){
  try{
    // confirm deletion with user
    if(!confirm('Are you sure you want to delete this product? This action cannot be undone.')){
      return
    }

    await api.delete(`/products/${product_id}`)
    console.log('Product deleted successfully') 
    // Refresh the product list after deletion
    fetchProducts()
  }catch(error){
    console.error('Error deleting product:', error)
  }
}

const totalQuantity = computed(() =>
  selectedProduct.value?.warehouses.reduce(
    (sum, w) => sum + w.quantity,
    0
  )
)

const editProduct = async(productId) => {
   try {
    const response = await api.get(`/products/${productId}`)
    const product = response.data

    console.log('Product data for editing:', product)

    product_id.value = productId

    // Populate form with product data
    form.value = {
      name: product.name,
      description: product.description,
      category: product.category,
      average_daily_sales: product.average_daily_sales,
      supplier_lead_time: product.supplier_lead_time,
      safety_stock: product.safety_stock,
      unit: product.unit,
    }

    showEditDialog.value = true
    v$.value.$reset()
  } catch (error) {
    console.error('Error fetching product for edit:', error)
  }
  showEditDialog.value = true
}


const form = ref({
  name: '',
  description: '',
  category: '',
  average_daily_sales: null,
  supplier_lead_time: null,
  safety_stock: null,
  unit: '',
})


// Validation rules
const rules = {
  name: { required },
  description: { required },
  category: { required },
  average_daily_sales: { required, minValue: minValue(0) },
  supplier_lead_time: { required, minValue: minValue(0) },
  safety_stock: { required, minValue: minValue(0) },
  unit: { required },
}

const v$ = useVuelidate(rules, form)

const categories = ['Raw Material', 'Finished Goods', 'Consumables']
const units = ['kg', 'Ltrs']


async function submitForm() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    console.log('Form is invalid', v$.value.$errors)
    return
  }

  const productData = { ...form.value }
  try {
    const response = await api.put(`/products/${product_id.value}`, productData)
    console.log('Product updated successfully:', response.data)
    fetchProducts() // Refresh the product list after updating
  } catch (error) {
    console.error('Error updating product:', error)
  }
}



  onMounted(() => {
    fetchProducts()
  })

 
</script>