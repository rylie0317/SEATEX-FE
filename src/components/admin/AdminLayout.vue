<script setup>
import AdminNavbar from './AdminNavbar.vue'
import AdminFooter from './AdminFooter.vue'
</script>

<template>
  <div class="admin-layout">

    <AdminNavbar />

    <main class="admin-main">
      <router-view />
    </main>

    <AdminFooter />

  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.admin-main {
  flex: 1;
}
</style>