<template>
  <v-container>
    <h2 class="text-h5 mb-4">Warehouse Structure</h2>

    <!-- 🔽 FILTERS -->
    <v-row class="mb-4" dense>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedZone"
          :items="zones"
          item-title="name"
          item-value="id"
          label="Select Zone"
          clearable
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="selectedRack"
          :items="filteredRacks"
          item-title="name"
          item-value="id"
          label="Select Rack"
          :disabled="!selectedZone"
          clearable
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="selectedBin"
          :items="filteredBins"
          item-title="code"
          item-value="id"
          label="Select Bin"
          :disabled="!selectedRack"
          clearable
        />
      </v-col>
    </v-row>

    <!-- 📊 TABLE -->
    <v-table>
      <thead>
        <tr>
          <th>#</th>
          <th>Zone</th>
          <th>Rack</th>
          <th>Bin Code</th>
          <th>Capacity</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in tableData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ row.zone }}</td>
          <td>{{ row.rack }}</td>
          <td>{{ row.bin }}</td>
          <td>{{ row.capacity }}</td>
        </tr>
      </tbody>
    </v-table>

    <!-- ACTION BUTTONS -->
    <v-row class="mt-6 mb-4" gap="2">
      <v-btn color="primary" @click="dialogs.zone = true">Add Zone</v-btn>
      <v-btn color="secondary" @click="dialogs.rack = true">Add Rack</v-btn>
      <v-btn color="success" @click="dialogs.bin = true">Add Bin</v-btn>
    </v-row>

    <!-- ================= ZONE ================= -->
    <v-dialog v-model="dialogs.zone" max-width="500">
      <v-card>
        <v-card-title class="bg-primary text-white">Create Zone</v-card-title>

        <v-card-text>
          <v-select
            v-model="newZone.warehouseId"
            :items="warehouses"
            item-title="name"
            item-value="id"
            label="Warehouse"
          />

          <v-text-field v-model="newZone.name" label="Zone Name" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogs.zone = false">Cancel</v-btn>
          <v-btn color="primary" @click="createZone">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= RACK ================= -->
    <v-dialog v-model="dialogs.rack" max-width="400">
      <v-card>
        <v-card-title>Add Rack</v-card-title>

        <v-card-text>
          <v-select
            v-model="newRack.zoneId"
            :items="zones"
            item-title="name"
            item-value="id"
            label="Select Zone"
          />

          <v-text-field v-model="newRack.name" label="Rack Name" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogs.rack = false">Cancel</v-btn>
          <v-btn color="primary" @click="createRack">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ================= BIN ================= -->
    <v-dialog v-model="dialogs.bin" max-width="400">
      <v-card>
        <v-card-title>Add Bin</v-card-title>

        <v-card-text>
          <v-select
            v-model="newBin.rackId"
            :items="allRacks"
            item-title="name"
            item-value="id"
            label="Select Rack"
          />

          <v-text-field v-model="newBin.level" label="Level" type="number" />
          <v-text-field v-model="newBin.position" label="Position" type="number" />
          <v-text-field v-model="newBin.capacity" label="Capacity" type="number" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogs.bin = false">Cancel</v-btn>
          <v-btn color="primary" @click="createBin">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"; 
import api from '@/plugins/api';

/* ================= MOCK WAREHOUSES ================= */
const warehouses = ref([]);

//get warehouse

const fetchWarehouse = async () => {
  try {
    const res = await api.get("/warehouses");
    warehouses.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchWarehouse);

/* ================= STATE ================= */
const zones = ref([]);

const dialogs = ref({
  zone: false,
  rack: false,
  bin: false,
});

/* ================= SELECTION ================= */
const selectedZone = ref(null);
const selectedRack = ref(null);
const selectedBin = ref(null);

/* ================= FORMS ================= */
const newZone = ref({
  name: "",
  warehouseId: null,
});

const newRack = ref({
  name: "",
  zoneId: null,
});

const newBin = ref({
  rackId: null,
  level: 1,
  position: 1,
  capacity: 0,
});

// Fetch zones with racks and bins

/* ================= COMPUTED: FILTERS ================= */
const filteredRacks = computed(() => {
  if (!selectedZone.value) return [];
  const zone = zones.value.find(z => z.id === selectedZone.value);
  return zone?.racks || [];
});

const filteredBins = computed(() => {
  if (!selectedRack.value) return [];
  const rack = filteredRacks.value.find(r => r.id === selectedRack.value);
  return rack?.bins || [];
});

const allRacks = computed(() => {
  return zones.value.flatMap(z => z.racks || []);
});

/* ================= TABLE DATA ================= */
const tableData = computed(() => {
  let rows = [];

  zones.value.forEach(zone => {
    if (selectedZone.value && zone.id !== selectedZone.value) return;

    zone.racks?.forEach(rack => {
      if (selectedRack.value && rack.id !== selectedRack.value) return;

      rack.bins?.forEach(bin => {
        if (selectedBin.value && bin.id !== selectedBin.value) return;

        rows.push({
          zone: zone.name,
          rack: rack.name,
          bin: bin.code,
          capacity: bin.capacity,
        });
      });
    });
  });

  return rows;
});

/* ================= CREATE ZONE ================= */
const createZone = async () => {
  try {
    const res = await api.post("/zone/create", {
      description: newZone.value.name,
      warehouse_id: newZone.value.warehouseId,
    });

    zone.value = res.data;
    
    zones.value.push({
      ...res.data,
      racks: [],
    });

    newZone.value = { name: "", warehouseId: null };
    dialogs.value.zone = false;

  } catch (err) {
    console.error(err);
  }
};

/* ================= CREATE RACK ================= */
const createRack = async () => {
  try {
    const res = await api.post("/racks", {
      name: newRack.value.name,
      zone_id: newRack.value.zoneId,
    });

    const zone = zones.value.find(z => z.id === newRack.value.zoneId);

    if (zone) {
      zone.racks.push({
        ...res.data,
        bins: [],
      });
    }

    newRack.value = { name: "", zoneId: null };
    dialogs.value.rack = false;

  } catch (err) {
    console.error(err);
  }
};

/* ================= CREATE BIN ================= */
const createBin = async () => {
  try {
    const res = await api.post("/bins", {
      rack_id: newBin.value.rackId,
      level: newBin.value.level,
      position: newBin.value.position,
      capacity: newBin.value.capacity,
    });

    for (const zone of zones.value) {
      const rack = zone.racks?.find(r => r.id === newBin.value.rackId);

      if (rack) {
        rack.bins.push(res.data);
        break;
      }
    }

    newBin.value = {
      rackId: null,
      level: 1,
      position: 1,
      capacity: 0,
    };

    dialogs.value.bin = false;

  } catch (err) {
    console.error(err);
  }
};
</script>