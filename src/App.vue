<template>
  <Navbar v-if="!route.meta.adminLayout" />

  <main class="seatex-app-main">
    <router-view />
  </main>

  <Footer
    v-if="!route.meta.hideFooter && !route.meta.adminLayout"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
</script>