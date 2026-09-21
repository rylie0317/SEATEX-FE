<template>

  <section class="reservations-page py-5">

    <div class="container">

      <!-- HEADER -->
      <div class="page-header mb-4">

        <span class="seatex-badge-label">
          MY ACCOUNT
        </span>

        <h1 class="page-title mt-2 mb-2">
          My Reservations
        </h1>

        <p class="text-muted mb-0">
          View your SEATEX bookings and payment status.
        </p>

      </div>


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
          Loading your reservations...
        </p>

      </div>


      <!-- RESERVATIONS -->
      <div
        v-else-if="bookings.length > 0"
        class="row g-4"
      >

        <div
          v-for="booking in bookings"
          :key="booking._id"
          class="col-12"
        >

          <div class="reservation-card">

            <!-- TOP -->
            <div class="reservation-header">

              <div>

                <span class="booking-label">
                  BOOKING REFERENCE
                </span>

                <strong class="booking-id">
                  {{ booking._id }}
                </strong>

              </div>

              <span
                class="status-badge"
                :class="getStatusClass(booking)"
              >
                {{ getPaymentStatus(booking) }}
              </span>

            </div>


            <hr>


            <!-- FAILED PAYMENT MESSAGE -->
            <div
              v-if="booking.paymentStatus === 'Failed'"
              class="payment-failed-alert mt-3"
            >

              <div class="payment-failed-icon">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>

              <div class="payment-failed-content">

                <strong>
                  Payment Needs Attention
                </strong>

                <p>
                  Your payment could not be approved.
                </p>

                <div
                  v-if="booking.failureReason"
                  class="failure-reason"
                >
                  <span>
                    REASON
                  </span>

                  <strong>
                    {{ booking.failureReason }}
                  </strong>
                </div>

                <button
                  type="button"
                  class="btn btn-primary rounded-pill px-4 mt-3"
                  @click="resubmitPayment(booking)"
                >
                  <i class="bi bi-arrow-repeat me-2"></i>
                  Resubmit Payment
                </button>

              </div>

            </div>


            <!-- ROUTE -->
            <div class="route-section">

              <div class="route-location">

                <span>
                  FROM
                </span>

                <strong>
                  {{ booking.trip?.origin || 'N/A' }}
                </strong>

              </div>


              <div class="route-arrow">

                <i class="bi bi-arrow-right"></i>

              </div>


              <div class="route-location">

                <span>
                  TO
                </span>

                <strong>
                  {{ booking.trip?.destination || 'N/A' }}
                </strong>

              </div>

            </div>


            <!-- DETAILS -->
            <div class="details-grid mt-4">

              <div class="detail-item">

                <i class="bi bi-calendar3"></i>

                <div>

                  <span>
                    DEPARTURE DATE
                  </span>

                  <strong>
                    {{ formatDate(booking.trip?.departureDate) }}
                  </strong>

                </div>

              </div>


              <div class="detail-item">

                <i class="bi bi-clock"></i>

                <div>

                  <span>
                    DEPARTURE TIME
                  </span>

                  <strong>
                    {{ booking.trip?.departureTime || 'N/A' }}
                  </strong>

                </div>

              </div>


              <div class="detail-item">

                <i class="bi bi-bus-front"></i>

                <div>

                  <span>
                    BUS CLASS
                  </span>

                  <strong>
                    {{ booking.trip?.busClass || 'N/A' }}
                  </strong>

                </div>

              </div>


              <div class="detail-item">

                <i class="bi bi-people"></i>

                <div>

                  <span>
                    PASSENGERS
                  </span>

                  <strong>
                    {{ booking.numberOfPassengers || 0 }}
                  </strong>

                </div>

              </div>


              <div class="detail-item">

                <i class="bi bi-cash-stack"></i>

                <div>

                  <span>
                    TOTAL FARE
                  </span>

                  <strong>
                    ₱{{ formatAmount(booking.totalFare) }}
                  </strong>

                </div>

              </div>

            </div>


            <!-- PAYMENT -->
            <div class="payment-section mt-4">

              <div class="payment-info">

                <span>
                  PAYMENT
                </span>

                <strong>
                  {{ booking.paymentType || 'Downpayment' }}
                </strong>

              </div>


              <div class="payment-info">

                <span>
                  AMOUNT PAID
                </span>

                <strong class="amount-paid">
                  ₱{{ formatAmount(booking.paymentAmount) }}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- EMPTY -->
      <div
        v-else
        class="empty-state text-center"
      >

        <div class="empty-icon">

          <i class="bi bi-ticket-perforated"></i>

        </div>

        <h2 class="h5 fw-bold mt-3">
          No Reservations Yet
        </h2>

        <p class="text-muted">
          You don't have any SEATEX reservations yet.
        </p>

        <router-link
          to="/trips"
          class="btn btn-primary rounded-pill px-4"
        >

          <i class="bi bi-search me-2"></i>

          Find a Trip

        </router-link>

      </div>

    </div>

  </section>

</template>


<script setup>

import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { Notyf } from 'notyf'

import api from '../api.js'

import { useGlobalStore } from '../stores/global.js'


const router = useRouter()

const store = useGlobalStore()

const notyf = new Notyf()


const bookings = ref([])

const isLoading = ref(false)



async function loadBookings() {

  if (!store.user.token) {

    notyf.error(
      'Please log in to view your reservations.'
    )

    router.push({
      name: 'login'
    })

    return

  }


  try {

    isLoading.value = true


    const response = await api.get(
      '/bookings/get-bookings',
      {
        headers: {
          Authorization:
            `Bearer ${store.user.token}`
        }
      }
    )


    const fetchedBookings =
      Array.isArray(response.data)
        ? response.data
        : response.data.bookings || []


    bookings.value =
      fetchedBookings.sort(
        (a, b) =>
          new Date(b.bookedOn) -
          new Date(a.bookedOn)
      )


  } catch (error) {

    console.error(
      'Unable to load reservations:',
      error
    )


    notyf.error(
      error.response?.data?.message ||
      'Unable to load your reservations.'
    )

  } finally {

    isLoading.value = false

  }

}



function getPaymentStatus(booking) {

  return (
    booking.paymentStatus ||
    booking.status ||
    'Pending'
  )

}



function getStatusClass(booking) {

  const status =
    getPaymentStatus(booking)
      .toLowerCase()


  if (
    status.includes('approved') ||
    status.includes('paid') ||
    status.includes('confirmed')
  ) {

    return 'status-success'

  }


  if (
    status.includes('failed') ||
    status.includes('rejected') ||
    status.includes('cancelled')
  ) {

    return 'status-danger'

  }


  return 'status-pending'

}



function resubmitPayment(booking) {

  if (!booking?._id) {

    notyf.error(
      'Unable to open the payment page.'
    )

    return

  }


  router.push({
    name: 'payment',
    params: {
      bookingId: booking._id
    }
  })

}



function formatAmount(amount) {

  return Number(
    amount || 0
  ).toLocaleString(
    'en-PH',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  )

}



function formatDate(date) {

  if (!date) {

    return 'N/A'

  }


  const parsedDate =
    new Date(date)


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return date

  }


  return parsedDate.toLocaleDateString(
    'en-PH',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  )

}



onMounted(() => {

  loadBookings()

})

</script>


<style scoped>

.reservations-page {

  min-height:
    calc(100vh - 80px);

  background-color:
    #f8f9fb;

}


.page-header {

  max-width:
    750px;

}


.page-title {

  color:
    var(--seatex-navy);

  font-size:
    32px;

  font-weight:
    800;

}


.reservation-card {

  padding:
    24px;

  background-color:
    #ffffff;

  border:
    1px solid #e5e9ef;

  border-radius:
    18px;

  box-shadow:
    0 4px 18px
    rgba(20, 34, 51, 0.04);

}


.reservation-header {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    20px;

}


.booking-label {

  display:
    block;

  margin-bottom:
    5px;

  color:
    #8a96a3;

  font-size:
    10px;

  font-weight:
    800;

  letter-spacing:
    0.8px;

}


.booking-id {

  display:
    block;

  color:
    var(--seatex-navy);

  font-size:
    14px;

  word-break:
    break-all;

}


.status-badge {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  padding:
    7px 13px;

  border-radius:
    20px;

  font-size:
    11px;

  font-weight:
    700;

  white-space:
    nowrap;

}


.status-pending {

  background-color:
    #fff3cd;

  color:
    #856404;

}


.status-success {

  background-color:
    #d1e7dd;

  color:
    #0f5132;

}


.status-danger {

  background-color:
    #f8d7da;

  color:
    #842029;

}


/* FAILED PAYMENT */

.payment-failed-alert {

  display:
    flex;

  align-items:
    flex-start;

  gap:
    14px;

  padding:
    18px;

  background-color:
    #fff5f5;

  border:
    1px solid #f5c2c7;

  border-radius:
    14px;

}


.payment-failed-icon {

  width:
    40px;

  height:
    40px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  border-radius:
    50%;

  background-color:
    #f8d7da;

  color:
    #842029;

  font-size:
    18px;

}


.payment-failed-content {

  flex:
    1;

}


.payment-failed-content > strong {

  display:
    block;

  color:
    #842029;

  font-size:
    15px;

}


.payment-failed-content > p {

  margin:
    4px 0 0;

  color:
    #6c757d;

  font-size:
    13px;

}


.failure-reason {

  display:
    flex;

  flex-direction:
    column;

  gap:
    4px;

  margin-top:
    12px;

  padding:
    10px 12px;

  background-color:
    #ffffff;

  border:
    1px solid #f5c2c7;

  border-radius:
    8px;

}


.failure-reason span {

  color:
    #8a96a3;

  font-size:
    9px;

  font-weight:
    800;

  letter-spacing:
    0.7px;

}


.failure-reason strong {

  color:
    #842029;

  font-size:
    13px;

}


.route-section {

  display:
    flex;

  align-items:
    center;

  gap:
    25px;

  padding:
    20px;

  background-color:
    #f8f9fb;

  border-radius:
    14px;

}


.route-location {

  flex:
    1;

  display:
    flex;

  flex-direction:
    column;

  gap:
    5px;

}


.route-location span {

  color:
    #8a96a3;

  font-size:
    10px;

  font-weight:
    800;

  letter-spacing:
    0.8px;

}


.route-location strong {

  color:
    var(--seatex-navy);

  font-size:
    17px;

}


.route-arrow {

  width:
    38px;

  height:
    38px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  border-radius:
    50%;

  background-color:
    var(--seatex-primary-soft);

  color:
    var(--seatex-primary);

}


.details-grid {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    20px;

}


.detail-item {

  display:
    flex;

  align-items:
    flex-start;

  gap:
    10px;

}


.detail-item > i {

  color:
    var(--seatex-primary);

  font-size:
    17px;

  margin-top:
    2px;

}


.detail-item > div {

  display:
    flex;

  flex-direction:
    column;

  gap:
    4px;

}


.detail-item span {

  color:
    #8a96a3;

  font-size:
    10px;

  font-weight:
    700;

}


.detail-item strong {

  color:
    var(--seatex-navy);

  font-size:
    13px;

}


.payment-section {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    20px;

  padding:
    16px;

  background-color:
    #f8f9fb;

  border-radius:
    12px;

}


.payment-info {

  display:
    flex;

  flex-direction:
    column;

  gap:
    4px;

}


.payment-info span {

  color:
    #8a96a3;

  font-size:
    10px;

  font-weight:
    700;

}


.payment-info strong {

  color:
    var(--seatex-navy);

  font-size:
    14px;

}


.payment-info .amount-paid {

  color:
    var(--seatex-primary);

}


.empty-state {

  max-width:
    600px;

  margin:
    50px auto;

  padding:
    60px 20px;

  background-color:
    #ffffff;

  border-radius:
    18px;

}


.empty-icon {

  width:
    65px;

  height:
    65px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  margin:
    0 auto;

  border-radius:
    50%;

  background-color:
    var(--seatex-primary-soft);

  color:
    var(--seatex-primary);

  font-size:
    28px;

}


@media (max-width: 991px) {

  .details-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media (max-width: 576px) {

  .reservation-card {

    padding:
      18px;

  }


  .page-title {

    font-size:
      27px;

  }


  .reservation-header {

    align-items:
      flex-start;

    flex-direction:
      column;

  }


  .payment-failed-alert {

    flex-direction:
      column;

  }


  .route-section {

    flex-direction:
      column;

    align-items:
      stretch;

    gap:
      12px;

  }


  .route-arrow {

    margin:
      0 auto;

    transform:
      rotate(90deg);

  }


  .details-grid {

    grid-template-columns:
      1fr;

  }


  .payment-section {

    align-items:
      flex-start;

    flex-direction:
      column;

  }

}

</style>