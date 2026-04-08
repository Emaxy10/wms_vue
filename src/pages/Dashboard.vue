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
                    Welcome back, {{ user?.name }}! 
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/plugins/stores/auth.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// onMounted(async () => {
//   try {
//     if (!authStore.user) {
//       await authStore.fetchUser()
//     }

//     if (!authStore.user) {
//       router.push('/login')
//     }
//   } catch {
//     router.push('/login')
//   }
// })

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>
