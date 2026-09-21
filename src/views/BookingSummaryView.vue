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
          Back to Passenger Selection
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

          <p class="text-muted mt-3">
            Loading booking summary...
          </p>
        </div>

        <!-- SUMMARY -->
        <div v-else-if="trip">

          <div class="mb-4">
            <span class="seatex-badge-label">
              BOOKING SUMMARY
            </span>

            <h1 class="fw-bold mt-2 mb-2">
              Review Your Booking
            </h1>

            <p class="text-muted mb-0">
              Please review the details before creating your reservation.
            </p>
          </div>

          <div class="row g-4">

            <!-- BOOKING DETAILS -->
            <div class="col-12 col-lg-8">

              <!-- TRIP -->
              <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-4 p-lg-5">

                  <h2 class="h5 fw-bold mb-4">
                    Trip Information
                  </h2>

                  <div class="summary-route">

                    <div>
                      <span>FROM</span>

                      <strong>
                        {{ trip.origin }}
                      </strong>
                    </div>

                    <i class="bi bi-arrow-right text-primary"></i>

                    <div>
                      <span>TO</span>

                      <strong>
                        {{ trip.destination }}
                      </strong>
                    </div>

                  </div>

                  <div class="row g-4 mt-3">

                    <!-- DEPARTURE DATE -->
                    <div class="col-12 col-md-4">
                      <div class="info-item">

                        <i class="bi bi-calendar3"></i>

                        <div>
                          <span>
                            DEPARTURE DATE
                          </span>

                          <strong>
                            {{ formatDate(trip.departureDate) }}
                          </strong>
                        </div>

                      </div>
                    </div>

                    <!-- DEPARTURE TIME -->
                    <div class="col-12 col-md-4">
                      <div class="info-item">

                        <i class="bi bi-clock"></i>

                        <div>
                          <span>
                            DEPARTURE TIME
                          </span>

                          <strong>
                            {{ trip.departureTime }}
                          </strong>
                        </div>

                      </div>
                    </div>

                    <!-- BUS CLASS -->
                    <div class="col-12 col-md-4">
                      <div class="info-item">

                        <i class="bi bi-bus-front"></i>

                        <div>
                          <span>
                            BUS CLASS
                          </span>

                          <strong>
                            {{ trip.busClass || 'N/A' }}
                          </strong>
                        </div>

                      </div>
                    </div>

                    <!-- AVAILABLE SEATS -->
                    <div class="col-12 col-md-4">
                      <div class="info-item">

                        <i class="bi bi-person-check"></i>

                        <div>
                          <span>
                            AVAILABLE SEATS
                          </span>

                          <strong>
                            {{ trip.availableSeats }}
                          </strong>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>
              </div>

              <!-- BOOKER -->
              <div class="card border-0 shadow-sm rounded-4">

                <div class="card-body p-4 p-lg-5">

                  <h2 class="h5 fw-bold mb-2">
                    Booker Information
                  </h2>

                  <p class="text-muted small mb-4">
                    This reservation will be associated with your registered
                    SEATEX account.
                  </p>

                  <div class="account-box">

                    <div class="account-icon">
                      <i class="bi bi-person-circle"></i>
                    </div>

                    <div>

                      <span>
                        LOGGED-IN ACCOUNT
                      </span>

                      <strong>
                        {{ store.user.email || "Account" }}
                      </strong>

                    </div>

                  </div>

                  <div class="alert alert-light border mt-4 mb-0">

                    <div class="d-flex gap-2">

                      <i class="bi bi-info-circle text-primary"></i>

                      <p class="small text-muted mb-0">
                        Your registered account will be used for this
                        reservation. You do not need to enter passenger names or
                        mobile numbers again.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <!-- PRICE SUMMARY -->
            <div class="col-12 col-lg-4">

              <div class="card border-0 shadow-sm rounded-4">

                <div class="card-body p-4">

                  <h2 class="h5 fw-bold mb-4">
                    Fare Summary
                  </h2>

                  <div class="summary-row">

                    <span>
                      Fare per passenger
                    </span>

                    <strong>
                      ₱{{ formatAmount(trip.fare) }}
                    </strong>

                  </div>

                  <div class="summary-row">

                    <span>
                      Number of passengers
                    </span>

                    <strong>
                      {{ numberOfPassengers }}
                    </strong>

                  </div>

                  <hr />

                  <div class="summary-total">

                    <span>
                      Total Fare
                    </span>

                    <strong>
                      ₱{{ formatAmount(totalFare) }}
                    </strong>

                  </div>

                  <div class="downpayment-box mt-3">

                    <span>
                      30% Downpayment
                    </span>

                    <strong>
                      ₱{{ formatAmount(downpayment) }}
                    </strong>

                  </div>

                  <button
                    type="button"
                    class="btn btn-primary w-100 rounded-pill py-2 mt-4"
                    :disabled="isCreating"
                    @click="createBooking"
                  >

                    <span v-if="!isCreating">

                      Confirm Booking

                      <i class="bi bi-check2-circle ms-2"></i>

                    </span>

                    <span v-else>
                      Creating Booking...
                    </span>

                  </button>

                  <p class="text-muted text-center small mt-3 mb-0">
                    You will proceed to payment after the reservation is
                    created.
                  </p>

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

          <i class="bi bi-receipt display-4 text-muted"></i>

          <h2 class="h4 fw-bold mt-3">
            Booking information unavailable
          </h2>

          <p class="text-muted">
            We could not load the selected trip.
          </p>

          <button
            type="button"
            class="btn btn-primary rounded-pill px-4"
            @click="goBack"
          >
            Back
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
} from "vue";

import {
  useRoute,
  useRouter
} from "vue-router";

import { Notyf } from "notyf";

import api from "../api.js";
import { useGlobalStore } from "../stores/global.js";

const route = useRoute();
const router = useRouter();
const notyf = new Notyf();
const store = useGlobalStore();

const trip = ref(null);
const isLoading = ref(false);
const isCreating = ref(false);

const numberOfPassengers = computed(() => {
  return Number(route.query.passengers) || 1;
});

const totalFare = computed(() => {
  if (!trip.value) {
    return 0;
  }

  return (
    Number(trip.value.fare) *
    numberOfPassengers.value
  );
});

const downpayment = computed(() => {
  return totalFare.value * 0.3;
});

async function loadTrip() {
  const tripId = route.params.tripId;

  if (!tripId) {
    notyf.error("No trip was selected.");
    return;
  }

  try {
    isLoading.value = true;

    const response = await api.get("/trips");

    const trips = Array.isArray(response.data)
      ? response.data
      : [];

    trip.value =
      trips.find(
        (item) => item._id === tripId
      ) || null;

    if (!trip.value) {
      notyf.error("Trip could not be found.");
      return;
    }

    if (
      numberOfPassengers.value < 1 ||
      numberOfPassengers.value >
        Number(trip.value.availableSeats)
    ) {
      notyf.error(
        "The selected number of passengers is no longer available."
      );

      goBack();
    }

  } catch (error) {

    console.error(error);

    notyf.error(
      error.response?.data?.message ||
      "Unable to load booking information."
    );

  } finally {

    isLoading.value = false;

  }
}

async function createBooking() {

  if (!trip.value) {
    return;
  }

  if (!store.user.token) {

    notyf.error(
      "Please log in before creating a booking."
    );

    router.push({
      name: "login"
    });

    return;
  }

  try {

    isCreating.value = true;

    const response = await api.post(
      "/bookings/book",
      {
        tripId: trip.value._id,
        numberOfPassengers:
          numberOfPassengers.value
      },
      {
        headers: {
          Authorization:
            `Bearer ${store.user.token}`
        }
      }
    );

    if (response.status === 201) {

      notyf.success(
        response.data.message ||
        "Booking created successfully."
      );

      /*
       * The backend returns the newly created
       * booking. We will use its ID for the
       * payment step.
       */

      const bookingId =
        response.data.booking?._id;

      if (bookingId) {

        router.push({
          name: "payment",
          params: {
            bookingId
          }
        });

      } else {

        notyf.error(
          "Booking was created, but the booking ID was not returned."
        );

      }

    }

  } catch (error) {

    console.error(error);

    notyf.error(
      error.response?.data?.message ||
      "Unable to create booking."
    );

  } finally {

    isCreating.value = false;

  }
}

function goBack() {
  router.push({
    name: "booking",
    params: {
      tripId: route.params.tripId
    }
  });
}

function formatDate(date) {

  if (!date) {
    return "Date not available";
  }

  return new Date(date).toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
}

function formatAmount(amount) {
  return Number(amount).toFixed(2);
}

onBeforeMount(() => {
  loadTrip();
});
</script>

<style scoped>
.summary-route {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 18px;
  background-color: #f8f9fb;
  border-radius: 14px;
}

.summary-route > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-route span,
.info-item span,
.account-box span {
  color: #7a8797;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.summary-route strong {
  color: #183b63;
  font-size: 14px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-item > i {
  color: var(--seatex-primary);
  font-size: 18px;
  margin-top: 2px;
}

.info-item > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-item strong {
  color: #183b63;
  font-size: 13px;
}

.account-box {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background-color: #f8f9fb;
  border-radius: 14px;
}

.account-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.account-box > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.account-box strong {
  color: #183b63;
  font-size: 14px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
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
  color: var(--seatex-primary);
  font-size: 13px;
}

.downpayment-box strong {
  font-size: 15px;
}

@media (max-width: 576px) {

  .summary-route {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .summary-route > i {
    transform: rotate(90deg);
    align-self: center;
  }

}
</style>