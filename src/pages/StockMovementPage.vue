<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h6">
        Stock Movements
      </v-card-title>

      <v-divider />

      <v-table striped="even">
        <thead class="bg-primary">
          <tr>
            <th class="text-left text-white">Date</th>
            <th class="text-left text-white">Product Code</th>
            <th class="text-left text-white">Product Name</th>
            <th class="text-left text-white">Type</th>
            <th class="text-left text-white">Quantity</th>
            <th class="text-left text-white">Warehouse</th>
            <th class="text-left text-white">Location</th>
            <th class="text-left text-white">Initiator</th>
            <th class="text-left text-white">Reason</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="movement in movements"
            :key="movement.id"
          >
            <td>{{ formatDate(movement.created_at) }}</td>

            <td class="font-weight-medium">
              {{ movement.product.code }}
            </td>

            <td>{{ movement.product.name }}</td>

            <td>
              <v-chip
                size="small"
                :color="movement.type === 'IN' ? 'success' : 'error'"
                variant="flat"
              >
                {{ movement.type }}
              </v-chip>
            </td>

            <td>
              <v-chip
                size="small"
                color="primary"
                variant="tonal"
              >
                {{ movement.quantity }}
              </v-chip>
            </td>

            <td>{{ movement.warehouse.name }}</td>

            <td>{{ movement.warehouse.location }}</td>

            <td>
              <v-chip
                size="small"
                color="secondary"
                variant="tonal"
              >
                {{ movement.user ? movement.user.name : 'System' }}
              </v-chip>
            </td>

            <td>
              {{ movement.reason ?? '-' }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/api.js'

const movements = ref([])

onMounted(async () => {
  const response = await api.get('/stock-movements')
  movements.value = response.data
})

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>
