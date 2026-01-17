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

                //logout button
                <v-btn
                    color="error"
                    size="small"
                    class="ml-auto" 
                    @click="logout"
                        
                >Logout</v-btn>
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
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/plugins/stores/auth.js'

    const router = useRouter()
    const authStore = useAuthStore()

    onMounted(async () => {
        try {
            const response = await api.get('/products')
            console.log('Dashboard data:', response.data)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        }
    })

    async function logout() {
        // try {
        //     await api.post('/logout')
        //     router.push('/login')
        //     // Redirect to login page or show a message
        // } catch (error) {
        //     console.error('Error during logout:', error)
        // }

        try {
            await authStore.logout()
            router.push('/login')
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }
</script>
