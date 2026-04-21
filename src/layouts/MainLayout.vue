<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/plugins/stores/auth.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <v-app class="full-height">

    <!-- Top Bar -->
    <v-app-bar app color="deep-purple-accent-4  " theme="dark">

  <!-- Left: App Name -->
  <v-toolbar-title class="font-weight-bold">
    WMS
  </v-toolbar-title>

  <v-spacer />

  <!-- Right: Profile Menu -->
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <v-card min-width="200">
      
      <!-- User Info -->
      <v-list>
        <v-list-item>
          <v-list-item-title class="font-weight-medium">
            {{ user?.name }}
          </v-list-item-title>
        </v-list-item>

        <v-divider />

        <!-- Logout -->
        <v-list-item @click="logout" link>
          <v-list-item-title>
            <v-icon start color="error">mdi-logout</v-icon>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>

    </v-card>
  </v-menu>

</v-app-bar>

    <!-- Sidebar -->
   <v-navigation-drawer app color="white" theme="dark">
  <v-list nav density="compact">

    <!-- Dashboard -->
    <v-list-item
      title="Dashboard"
      prepend-icon="mdi-view-dashboard"
      :to="{ name: 'dashboard' }"
      link
    />

    <!-- Operations -->
    <v-subheader>Operations</v-subheader>

    <v-list-item
      title="Purchase Orders"
      prepend-icon="mdi-file-document-outline"
      :to="{ name: 'purchase-orders' }"
      link
    />

    <v-list-item
      title="Put-away"
      prepend-icon="mdi-arrow-collapse-down"
      :to="{ name: 'putaway' }"
      link
    />

    <!-- Inventory -->
    <v-subheader>Inventory</v-subheader>

    <v-list-item
      title="Products"
      prepend-icon="mdi-cube-outline"
      :to="{ name: 'products' }"
      link
    />

    <v-list-item
      title="Warehouses"
      prepend-icon="mdi-warehouse"
      :to="{ name: 'warehouses' }"
      link
    />

    <!-- Partners -->
    <v-subheader>Partners</v-subheader>

    <v-list-item
      title="Suppliers"
      prepend-icon="mdi-truck-delivery-outline"
      :to="{ name: 'suppliers' }"
      link
    />

    <v-list-item
      title="Clients"
      prepend-icon="mdi-account-group-outline"
      :to="{ name: 'clients' }"
      link
    />

    <!-- Admin -->
    <v-subheader>Admin</v-subheader>

    <v-list-item
      title="Users"
      prepend-icon="mdi-account-outline"
      :to="{ name: 'users' }"
      link
    />

  </v-list>
</v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-scroll">
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>

  </v-app>
</template>

<style>
.full-height {
  height: 100vh;
}

.main-scroll {
  height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>