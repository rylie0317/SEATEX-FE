<template>
  <div class="seatex-page">

    <!-- PAGE HEADER -->
    <section class="py-5 bg-light">
      <div class="container">

        <button
          type="button"
          class="btn btn-link text-decoration-none px-0 mb-4"
          @click="goBack"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Back to Trips
        </button>

        <div v-if="isLoading" class="text-center py-5">
          <div
            class="spinner-border text-primary"
            role="status"
          >
            <span class="visually-hidden">
              Loading...
            </span>
          </div>

          <p class="text-muted mt-3">
            Loading trip details...
          </p>
        </div>

        <div v-else-if="trip">

          <div class="mb-4">
            <span class="seatex-badge-label">
              TRIP DETAILS
            </span>

            <h1 class="fw-bold mt-2 mb-2">
              Your Selected Trip
            </h1>

            <p class="text-muted mb-0">
              Review the trip information before continuing.
            </p>
          </div>

          <!-- TRIP CARD -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">

            <!-- CARD HEADER -->
            <div class="p-4 p-lg-5 bg-white border-bottom">

              <div
                class="d-flex flex-column flex-md-row justify-content-between gap-3"
              >

                <div>
                  <span class="text-primary small fw-bold">
                    {{ trip.busClass || 'BUS TRIP' }}
                  </span>

                  <h2 class="fw-bold mt-2 mb-0">
                    {{ trip.origin }}
                    <i class="bi bi-arrow-right mx-2 text-primary"></i>
                    {{ trip.destination }}
                  </h2>
                </div>

                <div class="text-md-end">
                  <span
                    class="badge rounded-pill px-3 py-2"
                    :class="
                      trip.availableSeats > 5
                        ? 'text-bg-success'
                        : 'text-bg-warning'
                    "
                  >
                    <i class="bi bi-person-fill me-1"></i>
                    {{ trip.availableSeats }} seats available
                  </span>
                </div>

              </div>

            </div>

            <!-- TRIP INFORMATION -->
            <div class="p-4 p-lg-5">

              <div class="row g-4">

                <!-- DATE -->
                <div class="col-12 col-md-6 col-lg-3">
                  <div class="detail-item">

                    <div class="detail-icon">
                      <i class="bi bi-calendar-event"></i>
                    </div>

                    <div>
                      <span class="detail-label">
                        DEPARTURE DATE
                      </span>

                      <strong>
                        {{ formatDate(trip.departureDate) }}
                      </strong>
                    </div>

                  </div>
                </div>

                <!-- TIME -->
                <div class="col-12 col-md-6 col-lg-3">
                  <div class="detail-item">

                    <div class="detail-icon">
                      <i class="bi bi-clock"></i>
                    </div>

                    <div>
                      <span class="detail-label">
                        DEPARTURE TIME
                      </span>

                      <strong>
                        {{ trip.departureTime }}
                      </strong>
                    </div>

                  </div>
                </div>

                <!-- BUS CLASS -->
                <div class="col-12 col-md-6 col-lg-3">
                  <div class="detail-item">

                    <div class="detail-icon">
                      <i class="bi bi-bus-front"></i>
                    </div>

                    <div>
                      <span class="detail-label">
                        BUS CLASS
                      </span>

                      <strong>
                        {{ trip.busClass || 'N/A' }}
                      </strong>
                    </div>

                  </div>
                </div>

                <!-- AVAILABLE SEATS -->
                <div class="col-12 col-md-6 col-lg-3">
                  <div class="detail-item">

                    <div class="detail-icon">
                      <i class="bi bi-person-check"></i>
                    </div>

                    <div>
                      <span class="detail-label">
                        TOTAL AVAILABLE SEATS
                      </span>

                      <strong>
                        {{ trip.availableSeats }}
                      </strong>
                    </div>

                  </div>
                </div>

              </div>

              <!-- FARE -->
              <div class="fare-summary mt-5 p-4 rounded-4">

                <div>
                  <span class="text-muted small">
                    FARE PER PASSENGER
                  </span>

                  <h3 class="fw-bold mb-0">
                    ₱{{ formatAmount(trip.fare) }}
                  </h3>
                </div>

                <div class="text-md-end">
                  <span class="text-muted small d-block">
                    30% DOWNPAYMENT
                  </span>

                  <strong class="text-primary fs-5">
                    ₱{{ calculateDownpayment(trip.fare) }}
                  </strong>
                </div>

              </div>

              <!-- ACTION -->
              <div
                class="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4"
              >

                <button
                  type="button"
                  class="btn btn-outline-secondary rounded-pill px-4"
                  @click="goBack"
                >
                  <i class="bi bi-arrow-left me-2"></i>
                  Choose Another Trip
                </button>

                <button
                  type="button"
                  class="btn btn-primary rounded-pill px-4"
                  :disabled="trip.availableSeats <= 0"
                  @click="continueToBooking"
                >
                  Continue
                  <i class="bi bi-arrow-right ms-2"></i>
                </button>

              </div>

            </div>

          </div>

        </div>

        <!-- TRIP NOT FOUND -->
        <div
          v-else
          class="text-center py-5"
        >
          <i class="bi bi-bus-front display-4 text-muted"></i>

          <h2 class="h4 fw-bold mt-3">
            Trip not found
          </h2>

          <p class="text-muted">
            The selected trip could not be loaded.
          </p>

          <button
            type="button"
            class="btn btn-primary rounded-pill px-4"
            @click="goBack"
          >
            Back to Trips
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notyf } from 'notyf'

import api from '../api.js'

const route = useRoute()
const router = useRouter()
const notyf = new Notyf()

const trip = ref(null)
const isLoading = ref(false)

async function loadTrip() {
  const tripId = route.params.tripId

  if (!tripId) {
    notyf.error('No trip was selected.')
    return
  }

  try {
    isLoading.value = true

const response =
    await api.get(`/trips/specific/${tripId}`);

trip.value = response.data;

    if (!trip.value) {
      notyf.error('Trip could not be found.')
    }

  } catch (error) {
    console.error(error)

    notyf.error(
      error.response?.data?.message ||
      'Unable to load trip details.'
    )

  } finally {
    isLoading.value = false
  }
}

function continueToBooking() {
  if (!trip.value) {
    return
  }

  router.push({
    name: 'booking',
    params: {
      tripId: trip.value._id
    }
  })
}

function goBack() {
  router.push({
    name: 'trips'
  })
}

function formatDate(date) {
  if (!date) {
    return 'Date not available'
  }

  return new Date(date).toLocaleDateString(
    'en-PH',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  )
}

function formatAmount(amount) {
  return Number(amount).toFixed(2)
}

function calculateDownpayment(fare) {
  return (Number(fare) * 0.30).toFixed(2)
}

onBeforeMount(() => {
  loadTrip()
})
</script>

<style scoped>
.detail-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.detail-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.detail-item > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detail-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--seatex-muted);
  letter-spacing: 0.5px;
}

.detail-item strong {
  color: var(--seatex-navy);
}

.fare-summary {
  background-color: var(--seatex-primary-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

@media (max-width: 576px) {
  .fare-summary {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>