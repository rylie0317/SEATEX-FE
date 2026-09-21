<template>
  <div class="seatex-page">

    <section class="py-5 bg-light">

      <div class="container">

        <!-- BACK -->
        <button
          type="button"
          class="btn btn-link text-decoration-none px-0 mb-4"
          @click="goBack"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Back to Trip Details
        </button>

        <!-- LOADING -->
        <div
          v-if="isLoading"
          class="text-center py-5"
        >

          <div
            class="spinner-border text-primary"
            role="status"
          >
            <span class="visually-hidden">
              Loading...
            </span>
          </div>

          <p class="text-muted mt-3 mb-0">
            Loading booking details...
          </p>

        </div>

        <!-- CONTENT -->
        <div v-else-if="trip">

          <div class="mb-4">

            <span class="seatex-badge-label">
              BOOK YOUR TRIP
            </span>

            <h1 class="fw-bold mt-2 mb-2">
              Select Passengers
            </h1>

            <p class="text-muted mb-0">
              Choose how many passengers will be included in this reservation.
            </p>

          </div>

          <div class="row g-4">

            <!-- LEFT: PASSENGER SELECTION -->
            <div class="col-12 col-lg-8">

              <div class="card border-0 shadow-sm rounded-4">

                <div class="card-body p-4 p-lg-5">

                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >

                    <div>

                      <h2 class="h5 fw-bold mb-1">
                        Number of Passengers
                      </h2>

                      <p class="text-muted small mb-0">
                        Available seats:
                        {{ trip.availableSeats }}
                      </p>

                    </div>

                    <i class="bi bi-people fs-3 text-primary"></i>

                  </div>

                  <!-- PASSENGER COUNTER -->
                  <div class="passenger-counter">

                    <button
                      type="button"
                      class="counter-button"
                      :disabled="numberOfPassengers <= 1"
                      @click="decreasePassengers"
                    >
                      <i class="bi bi-dash"></i>
                    </button>

                    <div class="passenger-number">

                      <strong>
                        {{ numberOfPassengers }}
                      </strong>

                      <span>
                        {{
                          numberOfPassengers === 1
                            ? 'Passenger'
                            : 'Passengers'
                        }}
                      </span>

                    </div>

                    <button
                      type="button"
                      class="counter-button"
                      :disabled="
                        numberOfPassengers >= trip.availableSeats
                      "
                      @click="increasePassengers"
                    >
                      <i class="bi bi-plus"></i>
                    </button>

                  </div>

                  <!-- INFORMATION -->
                  <div class="alert alert-light border mt-4 mb-0">

                    <div class="d-flex gap-2">

                      <i class="bi bi-info-circle text-primary"></i>

                      <div>

                        <strong class="small">
                          Seat availability
                        </strong>

                        <p class="small text-muted mb-0 mt-1">
                          Your reservation can include up to
                          {{ trip.availableSeats }}
                          passenger(s) based on the current available-seat
                          count.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <!-- RIGHT: SUMMARY -->
            <div class="col-12 col-lg-4">

              <div class="card border-0 shadow-sm rounded-4">

                <div class="card-body p-4">

                  <h2 class="h5 fw-bold mb-4">
                    Booking Summary
                  </h2>

                  <!-- ROUTE -->
                  <div class="summary-route mb-4">

                    <div>

                      <span>
                        FROM
                      </span>

                      <strong>
                        {{ trip.origin }}
                      </strong>

                    </div>

                    <i class="bi bi-arrow-down text-primary"></i>

                    <div>

                      <span>
                        TO
                      </span>

                      <strong>
                        {{ trip.destination }}
                      </strong>

                    </div>

                  </div>

                  <!-- DATE -->
                  <div class="summary-row">

                    <span>
                      <i class="bi bi-calendar3 me-2"></i>
                      Departure
                    </span>

                    <strong>
                      {{ formatDate(trip.departureDate) }}
                    </strong>

                  </div>

                  <!-- BUS CLASS -->
                  <div class="summary-row">

                    <span>
                      <i class="bi bi-bus-front me-2"></i>
                      Bus Class
                    </span>

                    <strong>
                      {{ trip.busClass || 'N/A' }}
                    </strong>

                  </div>

                  <!-- TIME -->
                  <div class="summary-row">

                    <span>
                      <i class="bi bi-clock me-2"></i>
                      Time
                    </span>

                    <strong>
                      {{ trip.departureTime }}
                    </strong>

                  </div>

                  <!-- PASSENGERS -->
                  <div class="summary-row">

                    <span>
                      <i class="bi bi-people me-2"></i>
                      Passengers
                    </span>

                    <strong>
                      {{ numberOfPassengers }}
                    </strong>

                  </div>

                  <hr>

                  <!-- TOTAL -->
                  <div class="summary-total">

                    <span>
                      Total Fare
                    </span>

                    <strong>
                      ₱{{ formatAmount(totalFare) }}
                    </strong>

                  </div>

                  <!-- DOWNPAYMENT -->
                  <div class="downpayment-box mt-3">

                    <span>
                      30% Downpayment
                    </span>

                    <strong>
                      ₱{{ formatAmount(downpayment) }}
                    </strong>

                  </div>

                  <!-- CONTINUE -->
                  <button
                  type="button"
                  class="btn btn-primary w-100 rounded-pill py-2 mt-4"
                  @click="continueToSummary"
                >
                  {{ store.user.token ? 'Continue' : 'Login to Continue' }}

                  <i
                    :class="
                      store.user.token
                        ? 'bi bi-arrow-right ms-2'
                        : 'bi bi-box-arrow-in-right ms-2'
                    "
                  ></i>
                </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        <!-- NOT FOUND -->
        <div
          v-else
          class="text-center py-5"
        >

          <i class="bi bi-bus-front display-4 text-muted"></i>

          <h2 class="h4 fw-bold mt-3">
            Trip not found
          </h2>

          <p class="text-muted">
            We could not load the selected trip.
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
import {
  computed,
  onBeforeMount,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'


import { Notyf } from 'notyf'

import api from '../api.js'

import { useGlobalStore } from '../stores/global.js'

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()
const notyf = new Notyf()

const trip = ref(null)
const isLoading = ref(false)

const numberOfPassengers = ref(1)

const totalFare = computed(() => {

  if (!trip.value) {
    return 0
  }

  return (
    Number(trip.value.fare) *
    numberOfPassengers.value
  )
})

const downpayment = computed(() => {
  return totalFare.value * 0.30
})

async function loadTrip() {

  const tripId = route.params.tripId

  if (!tripId) {

    notyf.error(
      'No trip was selected.'
    )

    return
  }

  try {

    isLoading.value = true

    const response =
      await api.get('/trips')

    const trips =
      Array.isArray(response.data)
        ? response.data
        : []

    trip.value =
      trips.find(
        (item) =>
          item._id === tripId
      ) || null

    if (!trip.value) {

      notyf.error(
        'Trip could not be found.'
      )

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

function increasePassengers() {

  if (!trip.value) {
    return
  }

  if (
    numberOfPassengers.value <
    Number(trip.value.availableSeats)
  ) {

    numberOfPassengers.value++

  }
}

function decreasePassengers() {

  if (
    numberOfPassengers.value > 1
  ) {

    numberOfPassengers.value--

  }
}

function continueToSummary() {

  if (!trip.value) {
    return
  }

  if (!store.user.token) {

    router.push({
      name: 'login',
      query: {
        redirect: route.fullPath,
        passengers: numberOfPassengers.value
      }
    })

    return
  }

  router.push({

    name: 'booking-summary',

    params: {
      tripId: trip.value._id
    },

    query: {
      passengers:
        numberOfPassengers.value
    }

  })

}

function goBack() {

  router.push({

    name: 'trip-details',

    params: {
      tripId:
        route.params.tripId
    }

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

onBeforeMount(() => {
  loadTrip()

  const passengers = Number(route.query.passengers)

  if (
    Number.isInteger(passengers) &&
    passengers >= 1
  ) {
    numberOfPassengers.value = passengers
  }
})

</script>

<style scoped>
.passenger-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 25px;
  background-color: #f8f9fb;
  border-radius: 16px;
}

.counter-button {
  width: 46px;
  height: 46px;
  border: 1px solid #d8dee8;
  border-radius: 50%;
  background-color: #ffffff;
  color: #1769e0;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.counter-button:hover:not(:disabled) {
  background-color: #1769e0;
  color: #ffffff;
}

.counter-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.passenger-number {
  min-width: 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.passenger-number strong {
  font-size: 30px;
  color: #183b63;
}

.passenger-number span {
  color: #647487;
  font-size: 13px;
}

.summary-route {
  padding: 16px;
  background-color: #f8f9fb;
  border-radius: 14px;
}

.summary-route > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.summary-route span {
  color: #7a8797;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.summary-route strong {
  color: #183b63;
  font-size: 14px;
}

.summary-route > i {
  margin: 10px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 13px;
}

.summary-row span {
  color: #647487;
}

.summary-row strong {
  color: #183b63;
  text-align: right;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-total span {
  color: #647487;
  font-size: 14px;
}

.summary-total strong {
  color: #183b63;
  font-size: 20px;
}

.downpayment-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 15px;
  border-radius: 10px;
  background-color: #e8f0fb;
  color: #1769e0;
  font-size: 13px;
}

.downpayment-box strong {
  font-size: 15px;
}

@media (max-width: 576px) {

  .passenger-counter {
    gap: 15px;
  }

  .counter-button {
    width: 42px;
    height: 42px;
  }

}
</style>