<template>
  <v-card>

    <!-- ================= HEADER (GRN CONTEXT) ================= -->
    <v-card-title class="bg-deep-purple-accent-4 text-white">
      Put Away - GRN Details
    </v-card-title>

    <v-card-text>
      <v-row class="mb-4">

        <v-col cols="12" md="4">
          <strong>GRN Number:</strong> {{ grn.grn_number }}
        </v-col>

        <v-col cols="12" md="4">
          <strong>Purchase Order:</strong> {{ grn.purchase_order_id }}
        </v-col>

        <v-col cols="12" md="4">
          <strong>Client:</strong> {{ grn.client_name }}
        </v-col>

        <v-col cols="12" md="4">
          <strong>Warehouse:</strong> {{ grn.warehouse_name }}
        </v-col>

        <v-col cols="12" md="4">
          <strong>Date Received:</strong> {{ formatDate(grn.received_date) }}
        </v-col>

        <v-col cols="12" md="4">
          <v-chip
            :color="grn.status === 'Pending' ? 'orange' : 'green'"
          >
            {{ grn.status }}
          </v-chip>
        </v-col>

      </v-row>

      <v-divider class="mb-4" />

      <!-- ================= ITEMS TABLE ================= -->
      <v-table>
        <thead class="bg-grey-lighten-3">
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>SKU / Barcode</th>
            <th>Qty Received</th>
            <th>Qty Remaining</th>
            <th>Unit</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in grnItems" :key="item.id">

            <td>{{ index + 1 }}</td>

            <td>{{ item.product_name }}</td>

            <td>{{ item.sku }}</td>

            <td>{{ item.quantity_received }}</td>

            <td>
              <v-chip
                size="small"
                :color="item.remaining_qty > 0 ? 'orange' : 'green'"
              >
                {{ item.remaining_qty }}
              </v-chip>
            </td>

            <td>{{ item.unit }}</td>

          </tr>
        </tbody>
      </v-table>

    </v-card-text>

  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/api.js'

// GRN HEADER
const grn = ref({
  grn_number: '',
  purchase_order_id: '',
  client_name: '',
  warehouse_name: '',
  received_date: '',
  status: ''
})

// ITEMS
const grnItems = ref([])

// FETCH DATA
async function fetchPutAwayData() {
  // example endpoint: /grns/{id}
  const res = await api.get('/grns/1')

  const data = res.data

  grn.value = {
    grn_number: data.grn_number,
    purchase_order_id: data.purchase_order_id,
    client_name: data.client?.name,
    warehouse_name: data.warehouse?.name,
    received_date: data.received_date,
    status: data.status
  }

  // items
  grnItems.value = data.items.map(item => ({
    id: item.id,
    product_name: item.product?.name,
    sku: item.product?.sku || item.product?.barcode,
    quantity_received: item.quantity_received,
    remaining_qty: item.quantity_received - (item.quantity_put_away || 0),
    unit: item.unit || 'pcs'
  }))
}

// UTIL
function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : '-'
}

onMounted(fetchPutAwayData)
</script>