<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/plugins/stores/auth.js'
import api from '@/plugins/api'


const router = useRouter()
const authStore = useAuthStore()

const page = ref(1)
const itemsPerPage = 10

const infoDialog = ref(false)
const selectedItem = ref(null)

// Dummy data (replace with API)
const putaways = ref([])

function viewItem(item) {
  selectedItem.value = item
  infoDialog.value = true
  console.log('View:', item)
}

function startPutaway(item) {
  console.log('Putaway:', item)
}

async function fetchPutaways() {
  try {
    const response = await api.get('/putaways')
    putaways.value = response.data.data
  } catch (error) {
    console.error('Error fetching put-away tasks:', error)
  }
}



onMounted(fetchPutaways)
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
            <th>#</th>
            <th>GRN Code</th>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in putaways" :key="item.id">
            <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>

            <td>{{ item.grn.grn_number }}</td>
            <td>{{ item.product.code }}</td>
            <td>{{ item.product.name }}</td>
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

    // Info Dialog
<v-dialog v-model="infoDialog" max-width="520">
  <v-card rounded="xl" elevation="10">

    <!-- Header -->
    <v-card-title class="bg-deep-purple-accent-4 text-white d-flex align-center">
      <v-icon class="mr-2">mdi-package-variant</v-icon>
      <span class="text-h6">Put-away Task Details</span>
      <v-spacer />
      <v-btn icon variant="text" @click="infoDialog = false">
        <v-icon class="text-white">mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <!-- Content -->
    <v-card-text class="pa-4" v-if="selectedItem">

      <v-row dense>

        <v-col cols="12">
          <v-card variant="tonal" class="pa-3">
            <strong>GRN Code</strong>
            <div class="text-subtitle-2 mt-1">
              {{ selectedItem.grn?.grn_number }}
            </div>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card variant="tonal" class="pa-3">
            <strong>Product</strong>
            <div class="text-subtitle-2 mt-1">
              {{ selectedItem.product?.name }}
              <span class="text-caption text-grey ml-2">
                ({{ selectedItem.product?.code }})
              </span>
            </div>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-caption">Quantity</div>
            <div class="text-h6 font-weight-bold">
              {{ selectedItem.quantity }}
            </div>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-caption">Status</div>
            <v-chip
              :color="selectedItem.status === 'pending' ? 'warning' : 'success'"
              size="small"
              class="mt-1"
            >
              {{ selectedItem.status }}
            </v-chip>
          </v-card>
        </v-col>

      </v-row>

    </v-card-text>

    <!-- Actions -->
    <v-card-actions class="pa-3">
      <v-spacer />
      <v-btn
        variant="outlined"
        color="grey-darken-1"
        @click="infoDialog = false"
      >
        Close
      </v-btn>

      <v-btn
        color="success"
        variant="elevated"
        @click="startPutaway(selectedItem)"
      >
        <v-icon left>mdi-package-down</v-icon>
        Start Put-away
      </v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>
  </v-container>
</template>