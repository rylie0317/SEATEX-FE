<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Notyf } from 'notyf'
import api from '../../api.js'
import { useGlobalStore } from '../../stores/global.js'

const store = useGlobalStore()
const notyf = new Notyf()

const trips = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const editingTripId = ref(null)
const showModal = ref(false)
const statusFilter = ref('active')
const search = ref('')

const form = reactive({
  origin: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  busClass: 'Regular Aircon',
  fare: '',
  totalSeats: ''
})

const busClasses = ['Regular Aircon', 'Deluxe', 'First Class', 'Sleeper']

const filteredTrips = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return trips.value.filter(trip => {
    if (statusFilter.value === 'active' && !trip.isActive) return false
    if (statusFilter.value === 'archived' && trip.isActive) return false

    if (!keyword) return true

    return [
      trip.origin,
      trip.destination,
      trip.departureTime,
      trip.busClass
    ].some(value => String(value || '').toLowerCase().includes(keyword))
  })
})

const activeCount = computed(() => trips.value.filter(trip => trip.isActive).length)
const archivedCount = computed(() => trips.value.filter(trip => !trip.isActive).length)

function headers() {
  return { Authorization: `Bearer ${store.user.token}` }
}

async function loadTrips() {
  isLoading.value = true

  try {
    const response = await api.get('/trips/all', { headers: headers() })
    trips.value = response.data || []
  } catch (error) {
    console.error('Unable to load trips:', error)
    notyf.error(error.response?.data?.message || 'Unable to load trips.')
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  form.origin = ''
  form.destination = ''
  form.departureDate = ''
  form.departureTime = ''
  form.busClass = 'Regular Aircon'
  form.fare = ''
  form.totalSeats = ''
  editingTripId.value = null
}

function openAddModal() {
  resetForm()
  showModal.value = true
}

function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function openEditModal(trip) {
  editingTripId.value = trip._id
  form.origin = trip.origin || ''
  form.destination = trip.destination || ''
  form.departureDate = toDateInput(trip.departureDate)
  form.departureTime = trip.departureTime || ''
  form.busClass = trip.busClass || 'Regular Aircon'
  form.fare = trip.fare ?? ''
  form.totalSeats = trip.totalSeats ?? ''
  showModal.value = true
}

function closeModal() {
  if (isSaving.value) return
  showModal.value = false
  resetForm()
}

async function saveTrip() {
  if (!form.origin.trim() || !form.destination.trim() || !form.departureDate || !form.departureTime) {
    notyf.error('Please complete all trip details.')
    return
  }

  const fare = Number(form.fare)
  const totalSeats = Number(form.totalSeats)

  if (!Number.isFinite(fare) || fare < 0) {
    notyf.error('Fare must be a valid non-negative amount.')
    return
  }

  if (!Number.isInteger(totalSeats) || totalSeats < 1) {
    notyf.error('Total seats must be a whole number greater than 0.')
    return
  }

  isSaving.value = true

  const payload = {
    origin: form.origin.trim(),
    destination: form.destination.trim(),
    departureDate: form.departureDate,
    departureTime: form.departureTime,
    busClass: form.busClass,
    fare,
    totalSeats
  }

  try {
    if (editingTripId.value) {
      await api.patch(`/trips/${editingTripId.value}`, payload, { headers: headers() })
      notyf.success('Trip updated successfully.')
    } else {
      await api.post('/trips', payload, { headers: headers() })
      notyf.success('Trip added successfully.')
    }

    closeModal()
    await loadTrips()
  } catch (error) {
    console.error('Unable to save trip:', error)
    notyf.error(error.response?.data?.message || 'Unable to save trip.')
  } finally {
    isSaving.value = false
  }
}

async function toggleTrip(trip) {
  const action = trip.isActive ? 'archive' : 'activate'
  const message = trip.isActive
    ? 'Archive this trip? It will no longer appear to customers.'
    : 'Activate this trip and make it available to customers?'

  if (!window.confirm(message)) return

  try {
    await api.patch(`/trips/${trip._id}/${action}`, {}, { headers: headers() })
    notyf.success(trip.isActive ? 'Trip archived successfully.' : 'Trip activated successfully.')
    await loadTrips()
  } catch (error) {
    console.error('Unable to change trip status:', error)
    notyf.error(error.response?.data?.message || 'Unable to change trip status.')
  }
}

function formatDate(date) {
  if (!date) return 'N/A'
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function seatClass(trip) {
  const ratio = trip.totalSeats ? trip.availableSeats / trip.totalSeats : 0
  if (ratio <= 0) return 'text-danger'
  if (ratio <= 0.25) return 'text-warning'
  return 'text-success'
}

onMounted(loadTrips)
</script>

<template>
  <section class="admin-trips-page py-5">
    <div class="container-fluid px-3 px-lg-4">
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <p class="section-label mb-2">ADMIN</p>
          <h1 class="page-title mb-2">Manage Trips</h1>
          <p class="text-muted mb-0">Create, update, archive, and activate SeatEx bus schedules.</p>
        </div>
        <button class="btn btn-dark rounded-pill px-4" type="button" @click="openAddModal">
          <i class="bi bi-plus-lg me-2"></i> Add Trip
        </button>
      </div>

      <div class="toolbar mb-4">
        <div class="search-wrap">
          <i class="bi bi-search"></i>
          <input v-model="search" type="search" class="form-control" placeholder="Search origin, destination, time, or bus class">
        </div>

        <div class="filter-tabs">
          <button type="button" :class="['filter-tab', { active: statusFilter === 'active' }]" @click="statusFilter = 'active'">
            Active <span>{{ activeCount }}</span>
          </button>
          <button type="button" :class="['filter-tab', { active: statusFilter === 'archived' }]" @click="statusFilter = 'archived'">
            Archived <span>{{ archivedCount }}</span>
          </button>
          <button type="button" :class="['filter-tab', { active: statusFilter === 'all' }]" @click="statusFilter = 'all'">
            All <span>{{ trips.length }}</span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="state-card text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-muted mt-3 mb-0">Loading trips...</p>
      </div>

      <div v-else-if="filteredTrips.length === 0" class="state-card text-center py-5">
        <div class="empty-icon"><i class="bi bi-bus-front"></i></div>
        <h2 class="h5 fw-bold mt-3">No trips found</h2>
        <p class="text-muted mb-0">Try another filter or add a new trip.</p>
      </div>

      <div v-else class="table-card">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th>Route</th>
                <th>Departure</th>
                <th>Class</th>
                <th>Fare</th>
                <th>Seats</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trip in filteredTrips" :key="trip._id">
                <td>
                  <div class="route-main">{{ trip.origin }} <i class="bi bi-arrow-right mx-1"></i> {{ trip.destination }}</div>
                  <small class="text-muted">{{ trip._id }}</small>
                </td>
                <td>
                  <strong>{{ formatDate(trip.departureDate) }}</strong>
                  <small class="d-block text-muted">{{ trip.departureTime }}</small>
                </td>
                <td>{{ trip.busClass || 'N/A' }}</td>
                <td>₱{{ formatAmount(trip.fare) }}</td>
                <td>
                  <strong :class="seatClass(trip)">{{ trip.availableSeats }}</strong>
                  <small class="text-muted"> / {{ trip.totalSeats }}</small>
                </td>
                <td>
                  <span :class="['status-badge', trip.isActive ? 'active-status' : 'archived-status']">
                    {{ trip.isActive ? 'Active' : 'Archived' }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary" title="Edit" @click="openEditModal(trip)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" :class="['btn btn-sm', trip.isActive ? 'btn-outline-danger' : 'btn-outline-success']" :title="trip.isActive ? 'Archive' : 'Activate'" @click="toggleTrip(trip)">
                      <i :class="trip.isActive ? 'bi bi-archive' : 'bi bi-arrow-counterclockwise'"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop-custom">
      <div class="trip-modal">
        <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div>
            <p class="section-label mb-1">TRIP MANAGEMENT</p>
            <h2 class="modal-title mb-1">{{ editingTripId ? 'Edit Trip' : 'Add Trip' }}</h2>
            <p class="text-muted small mb-0">Enter the schedule and fare information.</p>
          </div>
          <button type="button" class="close-button" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>

        <form @submit.prevent="saveTrip">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Origin</label>
              <input v-model="form.origin" type="text" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Destination</label>
              <input v-model="form.destination" type="text" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Departure Date</label>
              <input v-model="form.departureDate" type="date" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Departure Time</label>
              <input v-model="form.departureTime" type="text" class="form-control" placeholder="06:00 AM" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Bus Class</label>
              <select v-model="form.busClass" class="form-select" required>
                <option v-for="busClass in busClasses" :key="busClass" :value="busClass">{{ busClass }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Fare</label>
              <div class="input-group">
                <span class="input-group-text">₱</span>
                <input v-model="form.fare" type="number" min="0" step="0.01" class="form-control" required>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Total Seats</label>
              <input v-model="form.totalSeats" type="number" min="1" step="1" class="form-control" required>
            </div>
          </div>

          <div v-if="editingTripId" class="alert alert-light border mt-3 mb-0 small">
            Available seats are recalculated from confirmed bookings. The total seat capacity cannot be reduced below seats already used.
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-light rounded-pill px-4" :disabled="isSaving" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-dark rounded-pill px-4" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSaving ? 'Saving...' : (editingTripId ? 'Save Changes' : 'Add Trip') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-trips-page { min-height: 80vh; background:#f8f9fb; }
.section-label { color:#6c757d; font-size:11px; font-weight:800; letter-spacing:1px; }
.page-title { color:#212529; font-size:32px; font-weight:800; }
.toolbar { display:flex; align-items:center; justify-content:space-between; gap:15px; padding:14px; background:#fff; border:1px solid #e9ecef; border-radius:14px; }
.search-wrap { position:relative; flex:1; max-width:520px; }
.search-wrap i { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#8a96a3; }
.search-wrap input { padding-left:40px; border-radius:10px; }
.filter-tabs { display:flex; gap:5px; overflow:auto; }
.filter-tab { border:0; background:transparent; color:#6c757d; padding:8px 12px; border-radius:8px; font-size:13px; font-weight:700; white-space:nowrap; }
.filter-tab span { margin-left:4px; color:#9aa5b1; }
.filter-tab.active { background:#212529; color:#fff; }
.filter-tab.active span { color:#fff; }
.table-card, .state-card { background:#fff; border:1px solid #e9ecef; border-radius:16px; overflow:hidden; }
.table th { padding:14px 16px; color:#7b8794; font-size:10px; letter-spacing:.7px; text-transform:uppercase; background:#f8f9fa; white-space:nowrap; }
.table td { padding:16px; color:#495057; font-size:13px; }
.route-main { color:#212529; font-weight:700; white-space:nowrap; }
.status-badge { display:inline-block; padding:5px 9px; border-radius:20px; font-size:10px; font-weight:800; }
.active-status { background:#e8f7ee; color:#18794e; }
.archived-status { background:#eef0f2; color:#6c757d; }
.empty-icon { width:58px; height:58px; display:flex; align-items:center; justify-content:center; margin:auto; border-radius:50%; background:#f1f3f5; font-size:25px; }
.modal-backdrop-custom { position:fixed; inset:0; z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(15,25,35,.55); overflow:auto; }
.trip-modal { width:100%; max-width:720px; padding:26px; background:#fff; border-radius:18px; box-shadow:0 20px 60px rgba(0,0,0,.2); }
.modal-title { color:#212529; font-size:22px; font-weight:800; }
.close-button { width:35px; height:35px; border:0; border-radius:50%; background:#f1f3f5; color:#687583; }
.modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:24px; }
@media(max-width:767px) { .toolbar { flex-direction:column; align-items:stretch; } .search-wrap { max-width:none; } .filter-tabs { width:100%; } .trip-modal { padding:20px; } }
</style>
