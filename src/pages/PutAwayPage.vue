<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/plugins/stores/auth.js'
import api from '@/plugins/api'


const router = useRouter()
const authStore = useAuthStore()

// Dummy data (replace with API)
const putaways = ref([])

function viewItem(item) {
  console.log('View:', item)
}

function startPutaway(item) {
  console.log('Putaway:', item)
}

async function fetchPutaways() {
  try {
    const response = await api.get('/putaways')
    putaways.value = response.data
  } catch (error) {
    console.error('Error fetching put-away tasks:', error)
  }
}

onMounted(fetchPutaways())
</script>

<template>
  <v-container fluid>


    <!-- Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center bg-deep-purple-accent-4 text-white">
      <span class="text-h6">Put-away Tasks</span>
      <v-spacer />
      <v-icon>mdi-package-variant-closed</v-icon>
    </v-card-title>
      <v-table>

        <thead>
          <tr>
            <th>GRN Code</th>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in putaways" :key="item.id">
            <td>{{ item.grn_code }}</td>
            <td>{{ item.product_code }}</td>
            <td>{{ item.product_name }}</td>
            <td>{{ item.quantity }}</td>

            <!-- Status -->
            <td>
              <v-chip color="warning" size="small">
                {{ item.status }}
              </v-chip>
            </td>

            <!-- Actions -->
            <td class="text-center">

              <!-- View -->
              <v-btn
                icon
                size="small"
                color="primary"
                @click="viewItem(item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>

              <!-- Put-away -->
              <v-btn
                icon
                size="small"
                color="success"
                class="ml-2"
                @click="startPutaway(item)"
              >
                <v-icon>mdi-package-down</v-icon>
              </v-btn>

            </td>
          </tr>
        </tbody>

      </v-table>
    </v-card>

  </v-container>
</template>