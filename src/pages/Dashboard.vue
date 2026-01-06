<template>
    <v-container class="pa-4" fluid>
        <div class="mx-auto" style="max-width: 1200px">
        <v-row class="mb-12" dense>
            <v-col cols="12" md="6">
            <v-card
                class="py-4"
                color="surface-variant"
                rounded="lg"
                variant="tonal"
            >
                <template #title>
                <h2 class="text-h5 font-medium">
                    Welcome to Your Vuetify 3 + Vite + Vue 3 Dashboard!
                </h2>
                </template>
            </v-card>
            </v-col>
        </v-row>
        <!-- Add your dashboard content here -->
    </div>
    </v-container>
</template>

<script setup>
    import { onMounted } from 'vue'
    import api from '@/plugins/api.js'

    onMounted(async () => {
        try {
            const response = await api.get('/products')
            console.log('Dashboard data:', response.data)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        }
    })
</script>
