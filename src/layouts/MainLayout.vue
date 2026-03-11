<template>
  <v-app class="full-height">

    <v-app-bar app>
      Application bar
    </v-app-bar>

    <v-navigation-drawer app>
      <v-list nav>
        <v-list-item title="Navigation drawer" link />
      </v-list>
    </v-navigation-drawer>

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