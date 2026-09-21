<script setup>
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../../stores/global.js'

const router = useRouter()
const store = useGlobalStore()

function logout() {
  store.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <nav class="admin-navbar">
    <div class="container-fluid px-3 px-lg-4">
      <div class="admin-navbar-inner">
        <router-link to="/admin/dashboard" class="admin-brand text-decoration-none">
          <span class="brand-main">SEATEX</span>
          <span class="brand-label">ADMIN</span>
        </router-link>

        <div class="admin-navigation">
          <router-link to="/admin/dashboard" class="admin-nav-link" active-class="active">
            <i class="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </router-link>

          <router-link to="/admin/payments" class="admin-nav-link" active-class="active">
            <i class="bi bi-shield-check"></i>
            <span>Payments</span>
          </router-link>

          <router-link to="/admin/trips" class="admin-nav-link" active-class="active">
            <i class="bi bi-bus-front"></i>
            <span>Trips</span>
          </router-link>

          <router-link to="/admin/bookings" class="admin-nav-link" active-class="active">
            <i class="bi bi-ticket-perforated"></i>
            <span>Bookings</span>
          </router-link>
        </div>

        <div class="admin-actions">
          <span class="admin-account d-none d-lg-flex">
            <i class="bi bi-person-circle"></i>
            {{ store.user.email || 'Admin' }}
          </span>

          <button type="button" class="admin-logout" @click="logout">
            <i class="bi bi-box-arrow-right"></i>
            <span class="d-none d-sm-inline">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.admin-navbar {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
  min-height: 72px;
}

.admin-navbar-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.brand-main {
  font-size: 24px;
  font-weight: 800;
  color: #212529;
}

.brand-label {
  padding: 4px 7px;
  border-radius: 6px;
  background: #212529;
  color: #ffffff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .8px;
}

.admin-navigation {
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 1;
  overflow-x: auto;
}

.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border-radius: 8px;
  color: #6c757d;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: .2s ease;
}

.admin-nav-link:hover {
  background: #f8f9fa;
  color: #212529;
}

.admin-nav-link.active {
  background: #212529;
  color: #ffffff;
}

.admin-actions {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}

.admin-account {
  align-items: center;
  gap: 7px;
  color: #495057;
  font-size: 12px;
  font-weight: 600;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-logout {
  border: 0;
  background: transparent;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 10px;
  border-radius: 8px;
}

.admin-logout:hover {
  background: #fff5f5;
}

@media (max-width: 900px) {
  .admin-navbar-inner {
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .admin-navigation {
    order: 3;
    flex-basis: 100%;
    padding-bottom: 2px;
  }
}
</style>
