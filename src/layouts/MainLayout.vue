<script setup>
</script>

<template>
  <v-app class="full-height">

    <!-- Top Bar -->
    <v-app-bar app>
      Application bar
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer app color="deep-purple-accent-4  " dark>
      <v-list nav density="compact">

        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          :to="{ name: 'dashboard' }"
          link
        />

        <v-list-item
          title="Purchase Orders"
          prepend-icon="mdi-file-document-outline"
          :to="{ name: 'purchase-orders' }"
          link
        />

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