<script setup>
import { computed, onMounted, ref } from 'vue'
import { Notyf } from 'notyf'
import api from '../../api.js'
import { useGlobalStore } from '../../stores/global.js'

const store = useGlobalStore()
const notyf = new Notyf()

const bookings = ref([])
const isLoading = ref(true)
const search = ref('')
const statusFilter = ref('all')
const selectedBooking = ref(null)

const filteredBookings = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return bookings.value.filter(booking => {
    if (statusFilter.value !== 'all' && booking.bookingStatus !== statusFilter.value) return false

    if (!keyword) return true

    const customer = booking.customer
    const trip = booking.trip
    const haystack = [
      booking._id,
      booking.paymentStatus,
      booking.bookingStatus,
      customer?.firstName,
      customer?.lastName,
      customer?.email,
      trip?.origin,
      trip?.destination,
      trip?.busClass
    ].join(' ').toLowerCase()

    return haystack.includes(keyword)
  })
})

function headers() {
  return { Authorization: `Bearer ${store.user.token}` }
}

async function loadBookings() {
  isLoading.value = true

  try {
    const response = await api.get('/bookings/admin/all', { headers: headers() })
    bookings.value = response.data || []
  } catch (error) {
    console.error('Unable to load bookings:', error)
    notyf.error(error.response?.data?.message || 'Unable to load bookings.')
  } finally {
    isLoading.value = false
  }
}

function formatDate(date) {
  if (!date) return 'N/A'
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' })
}

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString('en-PH', { minimumFractionDigits:2, maximumFractionDigits:2 })
}

function openDetails(booking) {
  selectedBooking.value = booking
}

function closeDetails() {
  selectedBooking.value = null
}

function statusClass(status) {
  if (status === 'Confirmed' || status === 'Approved') return 'status-success'
  if (status === 'Failed' || status === 'Cancelled') return 'status-danger'
  return 'status-pending'
}

onMounted(loadBookings)
</script>

<template>
  <section class="admin-bookings-page py-5">
    <div class="container-fluid px-3 px-lg-4">
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <p class="section-label mb-2">ADMIN</p>
          <h1 class="page-title mb-2">Bookings</h1>
          <p class="text-muted mb-0">View customer bookings, payment states, and trip details.</p>
        </div>
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" :disabled="isLoading" @click="loadBookings">
          <i class="bi bi-arrow-clockwise me-2"></i> Refresh
        </button>
      </div>

      <div class="toolbar mb-4">
        <div class="search-wrap">
          <i class="bi bi-search"></i>
          <input v-model="search" type="search" class="form-control" placeholder="Search booking, customer, route, or status">
        </div>
        <select v-model="statusFilter" class="form-select status-select">
          <option value="all">All booking statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div v-if="isLoading" class="state-card text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-muted mt-3 mb-0">Loading bookings...</p>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="state-card text-center py-5">
        <div class="empty-icon"><i class="bi bi-ticket-perforated"></i></div>
        <h2 class="h5 fw-bold mt-3">No bookings found</h2>
        <p class="text-muted mb-0">No bookings match the current search or filter.</p>
      </div>

      <div v-else class="table-card">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Passengers</th>
                <th>Payment</th>
                <th>Status</th>
                <th class="text-end">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in filteredBookings" :key="booking._id">
                <td>
                  <strong class="d-block booking-id">{{ booking._id }}</strong>
                  <small class="text-muted">{{ formatDate(booking.bookedOn) }}</small>
                </td>
                <td>
                  <strong class="d-block">{{ booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'N/A' }}</strong>
                  <small class="text-muted">{{ booking.customer?.email || 'N/A' }}</small>
                </td>
                <td>
                  <strong class="d-block">{{ booking.trip?.origin || 'N/A' }} → {{ booking.trip?.destination || 'N/A' }}</strong>
                  <small class="text-muted">{{ booking.trip?.busClass || 'N/A' }}</small>
                </td>
                <td>
                  <strong class="d-block">{{ formatDate(booking.trip?.departureDate) }}</strong>
                  <small class="text-muted">{{ booking.trip?.departureTime || 'N/A' }}</small>
                </td>
                <td>{{ booking.numberOfPassengers }}</td>
                <td>
                  <span :class="['status-badge', statusClass(booking.paymentStatus)]">{{ booking.paymentStatus }}</span>
                  <small class="d-block text-muted mt-1">₱{{ formatAmount(booking.paymentAmount) }}</small>
                </td>
                <td>
                  <span :class="['status-badge', statusClass(booking.bookingStatus)]">{{ booking.bookingStatus }}</span>
                </td>
                <td class="text-end">
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="openDetails(booking)">
                    <i class="bi bi-eye me-1"></i> View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="selectedBooking" class="modal-backdrop-custom" @click.self="closeDetails">
      <div class="details-modal">
        <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <p class="section-label mb-1">BOOKING DETAILS</p>
            <h2 class="modal-title mb-1">{{ selectedBooking._id }}</h2>
            <p class="text-muted small mb-0">Created {{ formatDate(selectedBooking.bookedOn) }}</p>
          </div>
          <button type="button" class="close-button" @click="closeDetails"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="route-box mb-4">
          <div><span>FROM</span><strong>{{ selectedBooking.trip?.origin || 'N/A' }}</strong></div>
          <i class="bi bi-arrow-right"></i>
          <div><span>TO</span><strong>{{ selectedBooking.trip?.destination || 'N/A' }}</strong></div>
        </div>

        <div class="row g-3">
          <div class="col-md-6"><div class="detail-box"><span>Customer</span><strong>{{ selectedBooking.customer ? `${selectedBooking.customer.firstName} ${selectedBooking.customer.lastName}` : 'N/A' }}</strong><small>{{ selectedBooking.customer?.email || 'N/A' }}</small></div></div>
          <div class="col-md-6"><div class="detail-box"><span>Mobile</span><strong>{{ selectedBooking.customer?.mobileNo || 'N/A' }}</strong></div></div>
          <div class="col-md-6"><div class="detail-box"><span>Departure</span><strong>{{ formatDate(selectedBooking.trip?.departureDate) }}</strong><small>{{ selectedBooking.trip?.departureTime || 'N/A' }}</small></div></div>
          <div class="col-md-6"><div class="detail-box"><span>Bus Class</span><strong>{{ selectedBooking.trip?.busClass || 'N/A' }}</strong></div></div>
          <div class="col-md-6"><div class="detail-box"><span>Passengers</span><strong>{{ selectedBooking.numberOfPassengers }}</strong></div></div>
          <div class="col-md-6"><div class="detail-box"><span>Total Fare</span><strong>₱{{ formatAmount(selectedBooking.totalFare) }}</strong></div></div>
          <div class="col-md-6"><div class="detail-box"><span>Payment Type</span><strong>{{ selectedBooking.paymentType || 'N/A' }}</strong></div></div>
          <div class="col-md-6"><div class="detail-box"><span>Amount Paid</span><strong>₱{{ formatAmount(selectedBooking.paymentAmount) }}</strong></div></div>
          <div class="col-12"><div class="detail-box"><span>Payment Status</span><strong>{{ selectedBooking.paymentStatus }}</strong><small v-if="selectedBooking.failureReason">Reason: {{ selectedBooking.failureReason }}</small></div></div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-dark rounded-pill px-4" @click="closeDetails">Close</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-bookings-page { min-height:80vh; background:#f8f9fb; }
.section-label { color:#6c757d; font-size:11px; font-weight:800; letter-spacing:1px; }
.page-title { color:#212529; font-size:32px; font-weight:800; }
.toolbar { display:flex; align-items:center; gap:15px; padding:14px; background:#fff; border:1px solid #e9ecef; border-radius:14px; }
.search-wrap { position:relative; flex:1; }
.search-wrap i { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#8a96a3; }
.search-wrap input { padding-left:40px; border-radius:10px; }
.status-select { max-width:230px; border-radius:10px; }
.table-card,.state-card { background:#fff; border:1px solid #e9ecef; border-radius:16px; overflow:hidden; }
.table th { padding:14px 16px; color:#7b8794; font-size:10px; letter-spacing:.7px; text-transform:uppercase; background:#f8f9fa; white-space:nowrap; }
.table td { padding:16px; color:#495057; font-size:12px; }
.booking-id { max-width:170px; overflow:hidden; text-overflow:ellipsis; }
.status-badge { display:inline-block; padding:5px 9px; border-radius:20px; font-size:10px; font-weight:800; white-space:nowrap; }
.status-success { background:#e8f7ee; color:#18794e; }
.status-danger { background:#fdebec; color:#b4232c; }
.status-pending { background:#fff3cd; color:#856404; }
.empty-icon { width:58px; height:58px; display:flex; align-items:center; justify-content:center; margin:auto; border-radius:50%; background:#f1f3f5; font-size:25px; }
.modal-backdrop-custom { position:fixed; inset:0; z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(15,25,35,.55); overflow:auto; }
.details-modal { width:100%; max-width:720px; padding:26px; background:#fff; border-radius:18px; box-shadow:0 20px 60px rgba(0,0,0,.2); }
.modal-title { color:#212529; font-size:20px; font-weight:800; word-break:break-all; }
.close-button { width:35px; height:35px; border:0; border-radius:50%; background:#f1f3f5; color:#687583; }
.route-box { display:flex; align-items:center; gap:18px; padding:17px; background:#f8f9fa; border-radius:13px; }
.route-box > div { flex:1; }
.route-box span,.detail-box span { display:block; color:#8a96a3; font-size:10px; font-weight:800; letter-spacing:.7px; margin-bottom:4px; }
.route-box strong { color:#212529; font-size:15px; }
.route-box > i { color:#0d6efd; }
.detail-box { padding:14px; border:1px solid #e9ecef; border-radius:12px; }
.detail-box strong { display:block; color:#212529; font-size:14px; }
.detail-box small { display:block; color:#7b8794; margin-top:3px; }
.modal-actions { display:flex; justify-content:flex-end; margin-top:22px; }
@media(max-width:767px) { .toolbar { flex-direction:column; align-items:stretch; } .status-select { max-width:none; } .details-modal { padding:20px; } .route-box { flex-direction:column; align-items:stretch; } .route-box > i { align-self:center; transform:rotate(90deg); } }
</style>
