<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-4">
      <v-col>
        <h2 class="text-h5 font-weight-bold">Putaway Management</h2>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="putawayItems"
        item-value="id"
        class="elevation-1"
      >
        <!-- Bin Select -->
        <template #item.bin="{ item }">
          <v-select
            v-model="item.selectedBin"
            :items="availableBins"
            item-title="code"
            return-object
            density="compact"
            placeholder="Select Bin"
          />
        </template>

        <!-- Available Space -->
        <template #item.space="{ item }">
          <span v-if="item.selectedBin">
            {{ getAvailableSpace(item.selectedBin) }}
          </span>
          <span v-else>-</span>
        </template>

        <!-- Action -->
        <template #item.action="{ item }">
          <v-btn
            color="primary"
            size="small"
            @click="handlePutaway(item)"
          >
            Putaway
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" color="success">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

/**
 * 📊 TABLE HEADERS
 */
const headers = [
  { title: "GRN Code", key: "grn" },
  { title: "Product Code", key: "product_code" },
  { title: "Product Name", key: "product_name" },
  { title: "Quantity", key: "quantity" },
  { title: "Select Bin", key: "bin" },
  { title: "Available Space", key: "space" },
  { title: "Action", key: "action", sortable: false },
];

/**
 * 🧾 MOCK PUTAWAY ITEMS
 */
const putawayItems = ref([
  {
    id: 1,
    grn: "GRN-001",
    product_code: "P-1001",
    product_name: "Rice 50kg",
    quantity: 20,
    selectedBin: null,
  },
  {
    id: 2,
    grn: "GRN-002",
    product_code: "P-2001",
    product_name: "Cooking Oil",
    quantity: 15,
    selectedBin: null,
  },
  {
    id: 3,
    grn: "GRN-003",
    product_code: "P-3001",
    product_name: "Sugar 25kg",
    quantity: 10,
    selectedBin: null,
  },
]);

/**
 * 🏬 MOCK BINS
 */
const availableBins = ref([
  { id: 1, code: "A-01-01", capacity: 100, used: 40 },
  { id: 2, code: "A-01-02", capacity: 80, used: 70 },
  { id: 3, code: "B-01-01", capacity: 120, used: 50 },
]);

/**
 * 🧠 HELPERS
 */
const getAvailableSpace = (bin) => {
  return bin.capacity - bin.used;
};

/**
 * 🔔 SNACKBAR
 */
const snackbar = ref({
  show: false,
  message: "",
});

/**
 * 🚀 PUTAWAY ACTION
 */
const handlePutaway = (item) => {
  if (!item.selectedBin) {
    snackbar.value = {
      show: true,
      message: "Please select a bin",
    };
    return;
  }

  const space = getAvailableSpace(item.selectedBin);

  if (item.quantity > space) {
    snackbar.value = {
      show: true,
      message: "Not enough space in selected bin",
    };
    return;
  }

  // Simulate update
  item.selectedBin.used += item.quantity;

  snackbar.value = {
    show: true,
    message: `${item.product_name} stored in ${item.selectedBin.code}`,
  };
};
</script>