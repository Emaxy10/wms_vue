<template>
    <v-card>
    
        <v-card-title>
        Warehouses
        </v-card-title>
    
        <v-card-text>
    
        <!-- Warehouse list -->
        <v-table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
            </tr>
            </thead>
    
            <tbody>
            <!-- Example warehouse row -->
            <tr v-for="warehouse in warehouses" :key="warehouse.id">
                <td>{{ warehouse.name }}</td>
                <td>{{ warehouse.location }}</td>
                <td>{{ warehouse.capacity }}</td>
            </tr>
            </tbody>
        </v-table>
    
        </v-card-text>
    
    </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const warehouses = ref([])

onMounted(() => {
    // Fetch warehouses from API (replace with actual API call)
    warehouses.value = [
        { id: 1, name: 'Warehouse A', location: 'City X', capacity: 1000 },
        { id: 2, name: 'Warehouse B', location: 'City Y', capacity: 1500 },
        { id: 3, name: 'Warehouse C', location: 'City Z', capacity: 2000 },
    ]
})
</script>