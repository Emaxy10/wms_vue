<template>
  <v-card>
    <!-- HEADER -->
    <v-card-title class="d-flex align-center">
      <span class="text-h6">Purchase Orders</span>
      <v-spacer />

      <v-btn
        color="primary"
        variant="outlined"
        :to="{ name: 'AddPurchaseOrderPage' }"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Purchase Order
      </v-btn>
    </v-card-title>

    <v-divider />

    <!-- FILTERS -->
    <v-card-text>
      <v-row class="mb-3">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="statusFilter"
            :items="['ALL', 'PENDING', 'APPROVED']"
            label="Status"
          />
        </v-col>
      </v-row>

      <!-- TABLE -->
      <v-table>
        <thead class="bg-deep-purple-accent-4 text-white">
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Client</th>
            <th>Warehouse</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Approved</th>
            <th>Order Date</th>
            <th class="text-center">Approve</th>
            <th class="text-center">Reject</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(po, index) in paginatedPOs" :key="po.id">

            <!-- SERIAL NUMBER -->
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>

            <td>{{ po.product?.name }}</td>
            <td>{{ po.client?.name }}</td>
            <td>{{ po.warehouse?.name }}</td>
            <td>{{ po.quantity_ordered }}</td>

            <td>
              <v-chip size="small" color="orange">
                {{ po.status }}
              </v-chip>
            </td>

            <td>
              <v-chip size="small" :color="po.is_approved ? 'green' : 'red'">
                {{ po.is_approved ? 'Approved' : 'Pending' }}
              </v-chip>
            </td>

            <td>{{ formatDate(po.order_date) }}</td>

            <!-- APPROVE -->
            <td class="text-center">
              <v-btn
                icon="mdi-check"
                variant="text"
                color="green"
                :disabled="po.is_approved || po.processing"
                @click="confirmApprove(po)"
              />
            </td>

            <!-- REJECT -->
            <td class="text-center">
              <v-btn
                icon="mdi-close"
                variant="text"
                color="red"
                :disabled="!po.is_approved || po.processing"
                @click="confirmReject(po)"
              />
            </td>

            <!-- ACTIONS -->
            <td>
              <div class="d-flex align-center ga-2">

                <!-- VIEW -->
                <v-btn
                  icon="mdi-eye"
                  variant="text"
                  @click="viewPO(po.id)"
                />

                <!-- EDIT -->
              <v-btn
              icon="mdi-pencil"
              variant="text"
              color="blue"
              @click="openEditModal(po)"
              />

                <!-- DELETE -->
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="red"
                  @click="deletePO(po.id)"
                />

                <!-- GRN -->
                <v-tooltip
                  :text="po.is_approved ? 'Generate GRN' : 'Approve PO first'"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                       icon="mdi-file-document"
                      variant="outlined"
                      color="blue"
                      size="small"
                      :disabled="!po.is_approved"
                      @click="openGrnModal(po)"
                    />
                  </template>
                </v-tooltip>

              </div>
            </td>

          </tr>
        </tbody>
      </v-table>

      <!-- PAGINATION -->
      <div class="d-flex justify-center mt-4">
        <v-pagination v-model="page" :length="totalPages" />
      </div>
    </v-card-text>
  </v-card>

  <!-- MODAL (FIXED) -->
  <v-dialog v-model="showDialog" max-width="700">
    <v-card v-if="selectedPO !== null">
      <v-card-title class="bg-deep-purple-accent-4 text-white">
        PO Details
      </v-card-title>

      <v-card-text>
        <p><strong>Product:</strong> {{ selectedPO.product?.name }}</p>
        <p><strong>Client:</strong> {{ selectedPO.client?.name }}</p>
        <p><strong>Warehouse:</strong> {{ selectedPO.warehouse?.name }}</p>
        <p><strong>Quantity:</strong> {{ selectedPO.quantity_ordered }}</p>
        <p><strong>Status:</strong> {{ selectedPO.status }}</p>

        <v-btn
          v-if="selectedPO.file_path"
          @click="downloadFile(selectedPO.id)"
          color="primary"
          variant="outlined"
        >
          Download File
        </v-btn>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="showDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Create GRN form modal -->
   <v-dialog v-model="showGrn" max-width="700">
  <v-card>

    <!-- HEADER -->
    <v-card-title class="bg-blue text-white">
      Create GRN
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submitGrn">

        <v-row>

          <!-- PURCHASE ORDER -->
          <v-col cols="12">
            <v-text-field
              label="Purchase Order Code"
              v-model="grnForm.purchase_order_code"
              readonly
            />
          </v-col>

          <!-- QUANTITY RECEIVED -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Quantity Received"
              type="number"
              v-model="grnForm.quantity_received"
               :error-messages="v$.quantity_received.$errors.map(e => e.$message)"
                @blur="v$.quantity_received.$touch()"
              required
            />
          </v-col>

          <!-- QUANTITY REJECTED -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Quantity Rejected"
              type="number"
              v-model="grnForm.quantity_rejected"
            />
          </v-col>

          <!-- RECEIVED DATE -->
          <v-col cols="12" md="6">
            <v-text-field
              label="Received Date"
              type="date"
              v-model="grnForm.received_date"
              required
            />
          </v-col>

          <!-- RECEIVED BY -->
          <v-col cols="12" md="6">
            <v-autocomplete
              label="Received By"
              v-model="grnForm.received_by"
              :items="filteredUsers"
              item-title="name"
              item-value="id"
              :search-input.sync="userSearch"
              clearable
              return-object
              :menu-props="{ maxHeight: 300 }"
              :filter="customFilter"
              :items-per-page="5"
              required
          />
          </v-col>

          <!-- REMARKS -->
          <v-col cols="12">
            <v-textarea
              label="Remarks"
              v-model="grnForm.remarks"
              rows="3"
            />
          </v-col>

        </v-row>

      </v-form>
    </v-card-text>

    <!-- ACTIONS -->
    <v-card-actions>
      <v-spacer />
      <v-btn @click="showGrn = false">Cancel</v-btn>

      <v-btn
        color="blue"
        variant="flat"
        @click="submitGrn"
      >
        Submit GRN
      </v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>



<!-- EDIT PO MODAL -->
<v-dialog v-model="showEditDialog" max-width="500">
  <v-card>
    <v-card-title class="bg-blue text-white">
      Edit Purchase Order
    </v-card-title>

    <v-card-text>
      <v-form>

        <v-text-field
          label="Product"
          :model-value="editPO?.product?.name"
          readonly
        />

        <!-- STATUS DROPDOWN -->
        <v-select
          v-model="editPO.status"
          :items="['PENDING', 'RECEIVED', 'CANCELLED']"
          label="Status"
        />

      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="showEditDialog = false">Cancel</v-btn>
      <v-btn color="blue" @click="updatePO">Save</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/api.js'
import useVuelidate from '@vuelidate/core'
import { required, numeric, minValue, helpers } from '@vuelidate/validators'
 import { useAuthStore } from '@/plugins/stores/auth.js'

const authStore = useAuthStore()
const showGrn = ref(false)
const selectedPOForGrn = ref(null)
const showEditDialog = ref(false)
const editPO = ref(null)
const warehouseUsersList = ref([])

const currentUser = computed(() => authStore.user)



const grnForm = ref({
   purchase_order_id: null,
  purchase_order_code: null,
  quantity_received: '',
  quantity_rejected: '',
  received_date: '',
  received_by: '',
  remarks: ''
})

const purchaseOrders = ref([])
const selectedPO = ref(null)
const showDialog = ref(false)

const search = ref('')
const statusFilter = ref('ALL')

const page = ref(1)
const itemsPerPage = 10

// Edit modal
function openEditModal(po) {
  editPO.value = { ...po } // clone
  showEditDialog.value = true
}


//Custom validation rules
const notGreaterThanOrdered = helpers.withMessage(
  'Quantity received cannot be greater than quantity ordered',
  value => {
    if (!value || !selectedPOForGrn.value) return true

    return Number(value) <= Number(selectedPOForGrn.value.quantity_ordered)
  }
)

//Rules
const rules = computed(() => ({
  quantity_received: {
    required,
    numeric,
    minValue: minValue(0),
    notGreaterThanOrdered
  },
  received_date: { required },
  received_by: { required }
}))


const v$ = useVuelidate(rules, grnForm)



// FETCH
async function fetchPurchaseOrders() {
  const res = await api.get('/purchase-orders')

  purchaseOrders.value = res.data.map(po => ({
    ...po,
    processing: false
  }))
}

// VIEW (FIXED MODAL)
async function viewPO(id) {
  try {
    const res = await api.get(`/purchase-orders/${id}`)
    selectedPO.value = res.data?.data || res.data
    showDialog.value = true
  } catch (err) {
    console.error(err)
  }
}

// DELETE
async function deletePO(id) {
  if (!confirm('Delete this purchase order?')) return
  await api.delete(`/purchase-orders/${id}`)
  fetchPurchaseOrders()
}

// APPROVE
async function approvePO(po) {
  po.processing = true
  await api.put(`/purchase-orders/${po.id}/approve`)
  fetchPurchaseOrders()
}

// REJECT
async function rejectPO(po) {
  po.processing = true
  await api.put(`/purchase-orders/${po.id}/reject`)
  fetchPurchaseOrders()
}

// CONFIRM
function confirmApprove(po) {
  if (!confirm('Approve this purchase order?')) return
  approvePO(po)
}

function confirmReject(po) {
  if (!confirm('Reject this purchase order?')) return
  rejectPO(po)
}

// FILTER
const filteredPOs = computed(() => {
  return purchaseOrders.value.filter(po => {
    const q = search.value.toLowerCase()

    const matchesSearch =
      po.product?.name?.toLowerCase().includes(q) ||
      po.client?.name?.toLowerCase().includes(q) ||
      po.warehouse?.name?.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter.value === 'ALL' ||
      (statusFilter.value === 'PENDING' && !po.is_approved) ||
      (statusFilter.value === 'APPROVED' && po.is_approved)

    return matchesSearch && matchesStatus
  })
})

// PAGINATION
const totalPages = computed(() =>
  Math.ceil(filteredPOs.value.length / itemsPerPage)
)

const paginatedPOs = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return filteredPOs.value.slice(start, start + itemsPerPage)
})

// UTIL
function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : '-'
}

function downloadFile(id) {
  const baseURL = api.defaults.baseURL
  window.open(`${baseURL}/purchase-orders/${id}/download-file`, '_blank')
}


function openGrnModal(po) {
  selectedPOForGrn.value = po

  grnForm.value = {
     purchase_order_id: po.id,
    purchase_order_code: po.code,
    quantity_received: po.quantity_ordered, // default
    quantity_rejected: 0,
    received_date: new Date().toISOString().substr(0, 10),
    received_by: '',
    remarks: ''
  }

  showGrn.value = true
}

// update satus
async function updatePO() {
  try {
    await api.put(`/purchase-orders/${editPO.value.id}`, {
      status: editPO.value.status
    })

    alert('Purchase Order updated successfully')

    showEditDialog.value = false
    fetchPurchaseOrders()

  } catch (err) {
    console.error(err)
    alert('Failed to update PO')
  }
}

//submit grn
async function submitGrn() {
  try {

     v$.value.$touch()

  if (v$.value.$invalid) {
    alert('Please fix validation errors')
    return
  }
    await api.post('/grn/create', grnForm.value)

    alert('GRN created successfully')

    showGrn.value = false
    fetchPurchaseOrders()

  } catch (err) {
    console.error(err)
    alert('Failed to create GRN')
  }
}

async function warehouseUsers(){
  const res = await api.get('warehouses/users')
  // console.log(res.data)
  warehouseUsersList.value = res.data
}

const userSearch = ref('')

// limit to 5 + search
function customFilter(item, queryText) {
  if (!queryText) return true

  return item.raw.name.toLowerCase().includes(queryText.toLowerCase())
}

//enforce max items in dropdown, so we control it manually
const filteredUsers = computed(() => {
  if (!userSearch.value) {
    return warehouseUsersList.value.slice(0, 5)
  }

  return warehouseUsersList.value
    .filter(user =>
      user.name.toLowerCase().includes(userSearch.value.toLowerCase())
    )
    .slice(0, 5)
})

grnForm.value.received_by = currentUser.id

onMounted(warehouseUsers)

onMounted(fetchPurchaseOrders)
</script>