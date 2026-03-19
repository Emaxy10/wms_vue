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
            label="Search (Product, Client, Warehouse)"
            prepend-inner-icon="mdi-magnify"
            clearable
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="statusFilter"
            :items="['ALL', 'PENDING', 'APPROVED']"
            label="Filter by Status"
          />
        </v-col>
      </v-row>

      <!-- TABLE -->
      <v-table>
        <thead class="bg-deep-purple-accent-4 text-white">
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Client</th>
            <th>Warehouse</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Approved</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="po in paginatedPOs" :key="po.id">
            <td>{{ po.id }}</td>
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
              <v-chip
                size="small"
                :color="po.is_approved ? 'green' : 'red'"
              >
                {{ po.is_approved ? 'Approved' : 'Pending' }}
              </v-chip>
            </td>

            <td>{{ formatDate(po.order_date) }}</td>

            <td>
              <!-- VIEW -->
              <v-btn icon="mdi-eye" variant="text" @click="viewPO(po.id)" />

              <!-- APPROVE -->
              <v-btn
                icon="mdi-check"
                variant="text"
                color="green"
                v-if="!po.is_approved"
                @click="approvePO(po.id)"
              />

              <!-- REJECT -->
              <v-btn
                icon="mdi-close"
                variant="text"
                color="red"
                v-if="po.is_approved"
                @click="rejectPO(po.id)"
              />

              <!-- DELETE -->
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="red"
                @click="deletePO(po.id)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- PAGINATION -->
      <div class="d-flex justify-center mt-4">
        <v-pagination
          v-model="page"
          :length="totalPages"
        />
      </div>
    </v-card-text>
  </v-card>

  <!-- MODAL -->
  <v-dialog v-model="showDialog" max-width="700">
    <v-card v-if="selectedPO">
      <v-card-title class="bg-deep-purple-accent-4 text-white">
        PO Details
      </v-card-title>

      <v-card-text>
        <p><strong>Product:</strong> {{ selectedPO.product?.name }}</p>
        <p><strong>Client:</strong> {{ selectedPO.client?.name }}</p>
        <p><strong>Warehouse:</strong> {{ selectedPO.warehouse?.name }}</p>
        <p><strong>Quantity:</strong> {{ selectedPO.quantity_ordered }}</p>
        <p><strong>Status:</strong> {{ selectedPO.status }}</p>

        <div v-if="selectedPO.file_path">
          <v-btn @click="downloadFile(selectedPO.id)" color="primary" variant="outlined">
            Download File
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="showDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/api.js'

const purchaseOrders = ref([])
const selectedPO = ref(null)
const showDialog = ref(false)

const search = ref('')
const statusFilter = ref('ALL')

const page = ref(1)
const itemsPerPage = 10

// FETCH
async function fetchPurchaseOrders() {
  const res = await api.get('/purchase-orders')
  purchaseOrders.value = res.data

  //console.log('Fetched POs:', purchaseOrders.value)
}

// VIEW
async function viewPO(id) {
  const res = await api.get(`/purchase-orders/${id}`)
  selectedPO.value = res.data
  showDialog.value = true

  console.log('Selected PO:', selectedPO.value  )
}

// DELETE
async function deletePO(id) {
  if (!confirm('Delete this PO?')) return
  await api.delete(`/purchase-orders/${id}`)
  fetchPurchaseOrders()
}

// APPROVE
async function approvePO(id) {
  await api.put(`/purchase-orders/${id}/approve`)
  fetchPurchaseOrders()
}

// REJECT
async function rejectPO(id) {
  await api.put(`/purchase-orders/${id}/reject`)
  fetchPurchaseOrders()
}

// FILTER + SEARCH
const filteredPOs = computed(() => {
  return purchaseOrders.value.filter(po => {
    const matchesSearch =
      po.product?.name?.toLowerCase().includes(search.value.toLowerCase()) ||
      po.client?.name?.toLowerCase().includes(search.value.toLowerCase()) ||
      po.warehouse?.name?.toLowerCase().includes(search.value.toLowerCase())

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

function downloadFile(POId) {
  // const baseURL = import.meta.env.VITE_API_BASE_URL || await api.getBaseURL()
   const baseURL = api.defaults.baseURL
  console.log('Downloading file for PO ID:', baseURL, POId)
  window.open(`${baseURL}/purchase-orders/${POId}/download-file`, '_blank')
}

onMounted(fetchPurchaseOrders)
</script>