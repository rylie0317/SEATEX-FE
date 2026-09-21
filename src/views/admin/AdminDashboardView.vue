<script setup>
import { computed, onMounted, ref } from 'vue'
import { Notyf } from 'notyf'
import api from '../../api.js'
import { useGlobalStore } from '../../stores/global.js'

const store = useGlobalStore()
const notyf = new Notyf()

const isLoading = ref(true)
const trips = ref([])
const bookings = ref([])
const errorMessage = ref('')

const stats = computed(() => {
  const activeTrips = trips.value.filter(trip => trip.isActive).length
  const totalSeats = trips.value.reduce((sum, trip) => sum + Number(trip.totalSeats || 0), 0)
  const availableSeats = trips.value.reduce((sum, trip) => sum + Number(trip.availableSeats || 0), 0)
  const pendingPayments = bookings.value.filter(booking => booking.paymentStatus === 'Pending Verification').length
  const confirmedBookings = bookings.value.filter(booking => booking.bookingStatus === 'Confirmed').length
  const totalRevenue = bookings.value
    .filter(booking => booking.paymentStatus === 'Approved')
    .reduce((sum, booking) => sum + Number(booking.paymentAmount || 0), 0)

  return { activeTrips, totalSeats, availableSeats, pendingPayments, confirmedBookings, totalRevenue }
})

async function loadDashboard() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const headers = { Authorization: `Bearer ${store.user.token}` }

    const [tripResponse, bookingResponse] = await Promise.all([
      api.get('/trips/all', { headers }),
      api.get('/bookings/admin/all', { headers })
    ])

    trips.value = tripResponse.data || []
    bookings.value = bookingResponse.data || []
  } catch (error) {
    console.error('Unable to load dashboard:', error)
    errorMessage.value = error.response?.data?.message || 'Unable to load dashboard data.'
    notyf.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

onMounted(loadDashboard)
</script>

<template>
  <section class="admin-dashboard-page py-5">
    <div class="container">
      <div class="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-5">
        <div>
          <p class="section-label text-uppercase mb-2">ADMIN DASHBOARD</p>
          <h1 class="page-title mb-2">Welcome, Admin</h1>
          <p class="text-muted mb-0">Monitor SeatEx trips, bookings, and payments from one place.</p>
        </div>

        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" :disabled="isLoading" @click="loadDashboard">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-muted mt-3 mb-0">Loading dashboard...</p>
      </div>

      <template v-else>
        <div class="row g-3 mb-4">
          <div class="col-6 col-xl-3">
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-bus-front"></i></div>
              <span>Active Trips</span>
              <strong>{{ stats.activeTrips }}</strong>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-ticket-perforated"></i></div>
              <span>Confirmed Bookings</span>
              <strong>{{ stats.confirmedBookings }}</strong>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-shield-exclamation"></i></div>
              <span>Pending Payments</span>
              <strong>{{ stats.pendingPayments }}</strong>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-cash-stack"></i></div>
              <span>Approved Payments</span>
              <strong>₱{{ formatAmount(stats.totalRevenue) }}</strong>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-4">
            <router-link to="/admin/payments" class="dashboard-card text-decoration-none">
              <div class="icon-wrapper"><i class="bi bi-shield-check"></i></div>
              <h2>Payment Verification</h2>
              <p>Review submitted payment proofs and verify customer payments.</p>
              <span>Review Payments <i class="bi bi-arrow-right ms-1"></i></span>
            </router-link>
          </div>

          <div class="col-lg-4">
            <router-link to="/admin/trips" class="dashboard-card text-decoration-none">
              <div class="icon-wrapper"><i class="bi bi-bus-front"></i></div>
              <h2>Manage Trips</h2>
              <p>Create schedules, update fares and seats, and archive trips.</p>
              <span>Manage Trips <i class="bi bi-arrow-right ms-1"></i></span>
            </router-link>
          </div>

          <div class="col-lg-4">
            <router-link to="/admin/bookings" class="dashboard-card text-decoration-none">
              <div class="icon-wrapper"><i class="bi bi-ticket-perforated"></i></div>
              <h2>Bookings</h2>
              <p>View customer bookings, payment states, and booking details.</p>
              <span>View Bookings <i class="bi bi-arrow-right ms-1"></i></span>
            </router-link>
          </div>
        </div>

        <div class="capacity-card mt-4">
          <div class="d-flex justify-content-between align-items-center gap-3 mb-2">
            <div>
              <span class="small text-muted">SEAT CAPACITY</span>
              <h2 class="h6 fw-bold mb-0">Available seats across all trips</h2>
            </div>
            <strong>{{ stats.availableSeats }} / {{ stats.totalSeats }}</strong>
          </div>
          <div class="progress" style="height: 9px;">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{ width: `${stats.totalSeats ? (stats.availableSeats / stats.totalSeats) * 100 : 0}%` }"
            ></div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.admin-dashboard-page { min-height: 80vh; background: #f8f9fb; }
.section-label { color: #6c757d; font-size: 11px; font-weight: 800; letter-spacing: 1px; }
.page-title { color: #212529; font-size: 32px; font-weight: 800; }
.stat-card { height: 100%; padding: 20px; background: #fff; border: 1px solid #e9ecef; border-radius: 16px; }
.stat-icon { width: 42px; height: 42px; display:flex; align-items:center; justify-content:center; margin-bottom: 14px; border-radius: 11px; background:#f1f3f5; color:#212529; }
.stat-card span { display:block; color:#7b8794; font-size:12px; margin-bottom:4px; }
.stat-card strong { color:#212529; font-size:22px; font-weight:800; }
.dashboard-card { display:block; height:100%; padding:24px; border:1px solid #e9ecef; border-radius:16px; background:#fff; color:inherit; transition:.2s ease; }
.dashboard-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.06); }
.icon-wrapper { width:48px; height:48px; display:flex; align-items:center; justify-content:center; border-radius:12px; background:#f1f3f5; }
.icon-wrapper i { font-size:22px; }
.dashboard-card h2 { color:#212529; font-size:18px; font-weight:800; margin-top:18px; }
.dashboard-card p { color:#6c757d; min-height:48px; }
.dashboard-card span { color:#0d6efd; font-weight:600; }
.capacity-card { padding:22px; background:#fff; border:1px solid #e9ecef; border-radius:16px; }
</style>
