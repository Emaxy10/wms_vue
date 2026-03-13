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
            <v-text-field
              v-model="selectedProductName"
              label="Select Product"
              variant="outlined"
              readonly
              clearable
              append-inner-icon="mdi-magnify"
              @click="openDialog('product')"
              @click:append-inner="clearProduct"
              :error-messages="v$.product_id.$errors.map(e => 'Product is required')"
            />
          </v-col>

          <!-- Client -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="selectedClientName"
              label="Select Client"
              variant="outlined"
              readonly
               clearable
               append-inner-icon="mdi-magnify"
                @click="openDialog('client')"
                @click:append-inner="clearClient"
                :error-messages="v$.client_id.$errors.map(e => 'Client is required')"
            />
          </v-col>

          <!-- Warehouse -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="selectedWarehouseName"
              label="Select Warehouse"
              variant="outlined"
              readonly
              clearable
              append-inner-icon="mdi-magnify"
                @click="openDialog('warehouse')"
                @click:append-inner="clearWarehouse"
                :error-messages="v$.warehouse_id.$errors.map(e => 'Warehouse is required')"
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
              :error-messages="v$.quantity_ordered.$errors.map(e => 'Quantity is required')"
            />
          </v-col>

          <!-- Unit -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.unit_of_measure"
              label="Unit of Measure (pcs, kg etc)"
              variant="outlined"
              required
              :error-messages="v$.unit_of_measure.$errors.map(e => 'Unit is required')"
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
              :error-messages="v$.order_date.$errors.map(e => 'Order date is required')"
            />
          </v-col>

          <!-- Expected Delivery -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.expected_delivery_date"
              label="Expected Delivery Date"
              type="date"
              variant="outlined"
              required
              :error-messages="v$.expected_delivery_date.$errors.map(e => {
                if (e.$validator === 'required') return 'Expected delivery date is required'
                if (e.$validator === 'deliveryAfterOrder') return 'Expected delivery must be after order date'
                return ''
              })"
            />
          </v-col>

          <!-- File -->
          <v-col cols="12">
            <v-file-input
             v-model="form.file"
              label="Attach File (PDF, Excel, Image, etc)"
              variant="outlined"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
              show-size

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

 <v-dialog v-model="showDialog" max-width="600">
  <v-card>

    <v-card-title class="text-h6">
      Select {{ dialogType }}
    </v-card-title>

    <v-divider />

    <v-card-text>

      <!-- Search -->
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        class="mb-3"
      />

      <!-- Numbered List -->
      <v-table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th v-if="dialogType === 'warehouse'">Location</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in filteredItems"
            :key="item.id"
            @click="selectItem(item)"
            style="cursor:pointer"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td v-if="dialogType === 'warehouse'">
              {{ item.location }}
            </td>
          </tr>
        </tbody>
      </v-table>

    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-end">
      <v-btn @click="showDialog=false">Close</v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/api.js'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'


const showDialog = ref(false)
const dialogType = ref('')
const search = ref('')

const selectedProductName = ref('')
const selectedClientName = ref('')
const selectedWarehouseName = ref('')

/* Form */
const form = ref({
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

//custom validation rules
const deliveryAfterOrder = (value) => {
  if (!value || !form.value.order_date) return true
  return new Date(value) >= new Date(form.value.order_date)
}

const rules = {
  product_id: { required },
  client_id: { required },
  warehouse_id: { required },
  quantity_ordered: { required },
  unit_of_measure: { required },
  status: { required },
  order_date: { required },
  expected_delivery_date: { required, deliveryAfterOrder }
}

const v$ = useVuelidate(rules, form)



/* Dropdown Data */
const products = ref([])
const clients = ref([])
const warehouses = ref([])

const showWarehouseDialog = ref(false)

/* Fetch Products */
const fetchProducts = async () => {
  const res = await api.get('/products')
  products.value = res.data
}

//Clear Product Selection
const clearProduct = () => {
  form.value.product_id = null
  selectedProductName.value = ''
}

/* Fetch Clients */
const fetchClients = async () => {
  const res = await api.get('/clients')
  clients.value = res.data
}
//Clear Client Selection
const clearClient = () => {
  form.value.client_id = null
  selectedClientName.value = ''
}




/* Fetch Warehouses */
const fetchWarehouses = async () => {
  const res = await api.get('/warehouses')
  warehouses.value = res.data
}

//Clear Warehouse Selection
const clearWarehouse = () => {
  form.value.warehouse_id = null
  selectedWarehouseName.value = ''
}



/* Open dialog */
const openDialog = (type) => {
  dialogType.value = type
  search.value = ''
  showDialog.value = true
}

/* Filter Items */
const filteredItems = computed(() => {

  let list = []

  if (dialogType.value === 'product') {
    list = products.value
  }

  if (dialogType.value === 'client') {
    list = clients.value
  }

  if (dialogType.value === 'warehouse') {
    list = warehouses.value
  }

  return list.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

/* Select Item */
const selectItem = (item) => {

  if (dialogType.value === 'product') {
    form.value.product_id = item.id
    selectedProductName.value = item.name
  }

  if (dialogType.value === 'client') {
    form.value.client_id = item.id
    selectedClientName.value = item.name
  }

  if (dialogType.value === 'warehouse') {
    form.value.warehouse_id = item.id
    selectedWarehouseName.value = item.name
  }

  showDialog.value = false
}



/* Submit */
const handleSubmit = async () => {


  const isValid = await v$.value.$validate()

  if (!isValid) return

  const formData = new FormData()

  formData.append('product_id', form.value.product_id)
  formData.append('client_id', form.value.client_id)
  formData.append('warehouse_id', form.value.warehouse_id)
  formData.append('quantity_ordered', form.value.quantity_ordered)
  formData.append('status', form.value.status)
  formData.append('order_date', form.value.order_date)
  formData.append('expected_delivery_date', form.value.expected_delivery_date)
  formData.append('unit_of_measure', form.value.unit_of_measure)

  if (form.value.file) {
    formData.append('file', form.value.file)
  }

  console.log(form.value.file)

  await api.post('purchase-order/create', formData)

  alert('Purchase Order Created Successfully')

   v$.value.$reset()
  form.value = {
    product_id: null,
    client_id: null,
    warehouse_id: null,
    quantity_ordered: null,
    status: 'PENDING',
    order_date: '',
    expected_delivery_date: '',
    unit_of_measure: '',
    file: null,
  }
}

/* Load */
onMounted(() => {
  fetchProducts()
  fetchClients()
  fetchWarehouses()
})
</script>