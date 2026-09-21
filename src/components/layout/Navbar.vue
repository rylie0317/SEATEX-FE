<template>
  <header class="seatex-navbar border-bottom bg-white sticky-top">
    <div class="container py-3">
      <div class="d-flex align-items-center justify-content-between">
        <!-- LOGO -->
        <router-link
          to="/"
          class="text-decoration-none d-flex align-items-center gap-2"
        >
            <img
            src="/SEATEX_logo.jpg"
            alt="SeatEx Logo"
            class="seatex-logo"
          />

          <div class="logo-title">SEAT<span>EX</span></div>
        </router-link>

        <!-- NAVIGATION -->
        <nav class="d-none d-lg-flex align-items-center gap-2">
          <router-link to="/" class="nav-item-btn text-decoration-none">
            Home
          </router-link>

          <router-link to="/trips" class="nav-item-btn text-decoration-none">
            Trips
          </router-link>

          <a href="/#about" class="nav-item-btn text-decoration-none">
            About
          </a>

          <a href="/#contact" class="nav-item-btn text-decoration-none">
            Contact
          </a>
        </nav>

        <!-- AUTH BUTTONS -->
        <div class="d-flex align-items-center gap-2">
          <!-- NOT LOGGED IN -->
          <template v-if="!store.user.token">
            <router-link
              to="/login"
              class="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold shadow-sm text-decoration-none"
            >
              <i class="bi bi-person-fill"></i>
              <span>Sign In / Register</span>
            </router-link>
          </template>

          <!-- LOGGED IN -->
          <template v-else>
            <router-link
              to="/my-reservations"
              class="btn btn-light d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold text-decoration-none"
            >
              <i class="bi bi-person-circle"></i>
              <span>My Account</span>
            </router-link>

            <router-link
              v-if="store.user.isAdmin"
              to="/admin/payments"
              class="btn btn-light d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold text-decoration-none"
            >
              <i class="bi bi-shield-check"></i>
              <span>Payment Verification</span>
            </router-link>

            <button
              type="button"
              class="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold"
              @click="handleLogout"
            >
              <i class="bi bi-box-arrow-right"></i>
              <span>Log Out</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../../stores/global.js'

const router = useRouter()
const store = useGlobalStore()

function handleLogout() {
  const confirmed = window.confirm(
    'Are you sure you want to log out?'
  )

  if (!confirmed) {
    return
  }

  store.logout()
  window.location.replace('/')
}
</script>

<style scoped>
.seatex-navbar {
  z-index: 1030;
}

.seatex-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
  border-radius: 8px;
}


.logo-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--seatex-navy);
}

.logo-title span {
  color: var(--seatex-primary);
}

.nav-item-btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--seatex-muted);
  border-radius: 20px;
  transition: all 0.2s ease;
}

.nav-item-btn:hover {
  color: var(--seatex-primary);
  background-color: var(--seatex-primary-soft);
}

.nav-item-btn.router-link-active {
  color: #ffffff;
  background-color: var(--seatex-primary);
}
</style>
