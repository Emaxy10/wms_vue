<script setup>
import { ref, onMounted } from 'vue'

// Dummy data (replace with API later)
const stats = ref({
  totalProducts: 1200,
  inboundToday: 45,
  outboundToday: 30,
  pendingPutaway: 12
})

const recentPOs = ref([
  { id: 'PO-001', supplier: 'ABC Ltd', status: 'Pending' },
  { id: 'PO-002', supplier: 'XYZ Ltd', status: 'Received' },
])

const lowStock = ref([
  { name: 'Item A', qty: 5 },
  { name: 'Item B', qty: 2 },
])

const movements = ref([
  { type: 'IN', product: 'Item A', qty: 20 },
  { type: 'OUT', product: 'Item B', qty: 10 },
])
</script>

<template>
  <v-container fluid>

    <!-- 🔥 KPI CARDS -->
    <v-row dense class="mb-4">

      <v-col cols="12" md="3">
        <v-card class="pa-4" elevation="2">
          <v-icon size="32" color="primary">mdi-cube-outline</v-icon>
          <div class="text-h6 mt-2">Total Products</div>
          <div class="text-h5 font-weight-bold">{{ stats.totalProducts }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4" elevation="2">
          <v-icon size="32" color="success">mdi-truck-delivery</v-icon>
          <div class="text-h6 mt-2">Inbound Today</div>
          <div class="text-h5 font-weight-bold">{{ stats.inboundToday }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4" elevation="2">
          <v-icon size="32" color="info">mdi-truck-fast</v-icon>
          <div class="text-h6 mt-2">Outbound Today</div>
          <div class="text-h5 font-weight-bold">{{ stats.outboundToday }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4" elevation="2">
          <v-icon size="32" color="warning">mdi-clock-outline</v-icon>
          <div class="text-h6 mt-2">Pending Put-away</div>
          <div class="text-h5 font-weight-bold">{{ stats.pendingPutaway }}</div>
        </v-card>
      </v-col>

    </v-row>

    <!-- 🔥 TABLES / OPERATIONS -->
    <v-row dense>

      <!-- Recent Purchase Orders -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Recent Purchase Orders</v-card-title>
          <v-table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="po in recentPOs" :key="po.id">
                <td>{{ po.id }}</td>
                <td>{{ po.supplier }}</td>
                <td>{{ po.status }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Low Stock Alerts -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Low Stock Alerts</v-card-title>
          <v-table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in lowStock" :key="item.name">
                <td>{{ item.name }}</td>
                <td class="text-error font-weight-bold">{{ item.qty }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

    </v-row>

    <!-- 🔥 STOCK MOVEMENTS -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Recent Stock Movements</v-card-title>
          <v-table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Product</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in movements" :key="m.product">
                <td>
                  <v-chip :color="m.type === 'IN' ? 'success' : 'error'" dark>
                    {{ m.type }}
                  </v-chip>
                </td>
                <td>{{ m.product }}</td>
                <td>{{ m.qty }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>