<template>
  <v-app>
      <router-view />
  </v-app>
</template>

<script setup>  
  import { useAuthStore } from '@/plugins/stores/auth.js'
  import { onMounted } from 'vue'

import { useRouter } from 'vue-router'


    const route = useRouter()

  const authStore = useAuthStore()
  // onMounted(() => {
  //   authStore.fetchUser().catch(() => {
  //     // User is not authenticated, you can handle it here if needed
  //    authStore.user = null

  //   if (route.path !== '/login') {
  //     window.location.href = '/login'
  //   }
  //   })
  // })
 
</script>
