<!-- <template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar title="Application bar"></v-app-bar>

    <v-navigation-drawer>
      <v-list nav>
        <v-list-item title="Navigation drawer" link></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pb-16">
        <router-view />
    </v-main>
  </v-layout>
</template> -->

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

    <v-main class="scrollable-main pb-16">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
.full-height {
  height: 100vh; /* make Vuetify app take full viewport height */
}

/* Make only v-main scrollable */
.scrollable-main {
  overflow-y: auto;
}
</style>