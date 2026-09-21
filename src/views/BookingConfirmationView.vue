<template>
  <section class="confirmation-page py-5">
    <div class="container">

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>

        <p class="text-muted mt-3 mb-0">
          Loading your booking confirmation...
        </p>
      </div>

      <!-- Confirmation -->
      <div v-else-if="booking" class="confirmation-wrapper">

        <!-- Success Header -->
        <div class="confirmation-header text-center mb-4">
          <div class="success-icon">
            <i class="bi bi-check-lg"></i>
          </div>

          <span class="section-label">
            BOOKING CONFIRMED
          </span>

          <h1 class="confirmation-title mt-2">
            Thank You for Booking with SEATEX!
          </h1>

          <p class="text-muted mb-0">
            Your booking has been successfully created.
            Your payment proof has been submitted for verification.
          </p>
        </div>

        <div class="row g-4">

          <!-- Booking Information -->
          <div class="col-lg-7">

            <div class="confirmation-card">

              <div class="card-header-custom">
                <div>
                  <span class="section-label">
                    BOOKING DETAILS
                  </span>

                  <h2 class="section-title mb-0">
                    Your Reservation
                  </h2>
                </div>

                <span class="status-badge">
                  {{ booking.paymentStatus || 'Pending' }}
                </span>
              </div>

              <!-- Booking Reference -->
              <div class="reference-box">
                <span>BOOKING REFERENCE</span>

                <strong>
                  {{ booking._id }}
                </strong>
              </div>

              <!-- Route -->
              <div class="route-box mt-4">

                <div class="route-point">
                  <span class="route-label">
                    FROM
                  </span>

                  <strong>
                    {{ booking.trip?.origin || 'N/A' }}
                  </strong>
                </div>

                <div class="route-arrow">
                  <i class="bi bi-arrow-right"></i>
                </div>

                <div class="route-point">
                  <span class="route-label">
                    TO
                  </span>

                  <strong>
                    {{ booking.trip?.destination || 'N/A' }}
                  </strong>
                </div>

              </div>

              <!-- Details -->
              <div class="details-grid mt-4">

                <div class="detail-item">
                  <span>Departure Date</span>

                  <strong>
                    {{ formatDate(booking.trip?.departureDate) }}
                  </strong>
                </div>

                <div class="detail-item">
                  <span>Departure Time</span>

                  <strong>
                    {{ booking.trip?.departureTime || 'N/A' }}
                  </strong>
                </div>

                <div class="detail-item">
                  <span>Bus Class</span>

                  <strong>
                    {{ booking.trip?.busClass || 'N/A' }}
                  </strong>
                </div>

                <div class="detail-item">
                  <span>Passengers</span>

                  <strong>
                    {{ booking.numberOfPassengers || 0 }}
                  </strong>
                </div>

                <div class="detail-item">
                  <span>Fare per Passenger</span>

                  <strong>
                    ₱{{ formatAmount(booking.trip?.fare) }}
                  </strong>
                </div>

              </div>

            </div>

            <!-- Payment Information -->
            <div class="confirmation-card mt-4">

              <div class="card-header-custom">
                <div>
                  <span class="section-label">
                    PAYMENT
                  </span>

                  <h2 class="section-title mb-0">
                    Payment Information
                  </h2>
                </div>

                <i class="bi bi-credit-card payment-icon"></i>
              </div>

              <div class="payment-details">

                <div class="payment-row">
                  <span>Payment Method</span>

                  <strong>
                    GCash
                  </strong>
                </div>

                <div class="payment-row">
                  <span>Payment Type</span>

                  <strong>
                    {{ booking.paymentType || 'Downpayment' }}
                  </strong>
                </div>

                <div class="payment-row">
                  <span>Total Fare</span>

                  <strong>
                    ₱{{ formatAmount(booking.totalFare) }}
                  </strong>
                </div>

                <div class="payment-row">
                  <span>Amount Paid</span>

                  <strong class="amount-paid">
                    ₱{{ formatAmount(booking.paymentAmount) }}
                  </strong>
                </div>

                <div class="payment-row">
                  <span>Payment Status</span>

                  <span class="pending-badge">
                    {{ booking.paymentStatus || 'Pending Verification' }}
                  </span>
                </div>

              </div>

            </div>

          </div>

          <!-- Right Column -->
          <div class="col-lg-5">

            <div class="confirmation-card next-steps-card">

              <span class="section-label">
                WHAT'S NEXT?
              </span>

              <h2 class="section-title mt-1">
                Payment Verification
              </h2>

              <div class="next-step">

                <div class="step-icon">
                  <i class="bi bi-file-earmark-check"></i>
                </div>

                <div>
                  <strong>
                    Payment proof submitted
                  </strong>

                  <p>
                    Your GCash receipt has been submitted successfully.
                  </p>
                </div>

              </div>

              <div class="next-step">

                <div class="step-icon">
                  <i class="bi bi-person-check"></i>
                </div>

                <div>
                  <strong>
                    Admin verification
                  </strong>

                  <p>
                    Your payment will be reviewed by the SEATEX admin.
                  </p>

                </div>

              </div>

              <div class="next-step">

                <div class="step-icon">
                  <i class="bi bi-ticket-perforated"></i>
                </div>

                <div>
                  <strong>
                    Booking confirmation
                  </strong>

                  <p>
                    Once your payment is approved, your booking will be
                    confirmed.
                  </p>
                </div>

              </div>

              <hr />

              <div class="contact-note">
                <i class="bi bi-info-circle-fill"></i>

                <p>
                  Please keep your booking reference for future
                  inquiries about your reservation.
                </p>
              </div>

              <div class="d-grid gap-2 mt-4">

                <router-link
                  to="/trips"
                  class="btn btn-primary rounded-pill py-3 fw-semibold"
                >
                  <i class="bi bi-search me-2"></i>
                  Browse More Trips
                </router-link>

                <router-link
                  to="/"
                  class="btn btn-outline-secondary rounded-pill py-3 fw-semibold"
                >
                  <i class="bi bi-house me-2"></i>
                  Back to Home
                </router-link>

              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- Booking Not Found -->
      <div v-else class="empty-state text-center">

        <i class="bi bi-receipt-cutoff"></i>

        <h2 class="h5 fw-bold mt-3">
          Booking Not Found
        </h2>

        <p class="text-muted">
          We could not find your booking information.
        </p>

        <router-link
          to="/trips"
          class="btn btn-primary rounded-pill px-4"
        >
          Browse Trips
        </router-link>

      </div>

    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api.js'
import { useGlobalStore } from '../stores/global.js'

const route = useRoute()
const router = useRouter()
const store = useGlobalStore()
const notyf = new Notyf()

const bookingId = route.params.bookingId

const booking = ref(null)
const isLoading = ref(false)

async function fetchBooking() {
  if (!store.user.token) {
    notyf.error('Please log in to continue.')
    router.push('/login')
    return
  }

  isLoading.value = true

  try {
    const response = await api.get('/bookings/get-bookings', {
      headers: {
        Authorization: `Bearer ${store.user.token}`
      }
    })

    const bookings = Array.isArray(response.data)
      ? response.data
      : response.data.bookings || []

    booking.value = bookings.find(
      item => String(item._id) === String(bookingId)
    )

    if (!booking.value) {
      notyf.error('Booking not found.')
    }

  } catch (error) {
    console.error('Unable to load booking:', error)

    if (error.response) {
      notyf.error(
        error.response.data.message ||
        'Unable to load booking details.'
      )
    } else {
      notyf.error(
        'Unable to connect to the SEATEX server.'
      )
    }

  } finally {
    isLoading.value = false
  }
}

function formatAmount(amount) {
  return Number(amount || 0).toLocaleString(
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

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
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
  fetchBooking()
})
</script>

<style scoped>
.confirmation-page {
  min-height: calc(100vh - 80px);
  background-color: #f8f9fb;
}

.confirmation-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.confirmation-header {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.success-icon {
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  border-radius: 50%;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
  font-size: 30px;
}

.section-label {
  display: inline-block;
  color: var(--seatex-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.confirmation-title {
  color: var(--seatex-navy);
  font-size: 32px;
  font-weight: 800;
}

.confirmation-card {
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(20, 34, 51, 0.04);
}

.card-header-custom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.section-title {
  color: var(--seatex-navy);
  font-size: 20px;
  font-weight: 800;
}

.status-badge,
.pending-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #fff3cd;
  color: #856404;
  font-size: 11px;
  font-weight: 700;
}

.payment-icon {
  color: var(--seatex-primary);
  font-size: 24px;
}

.reference-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 16px;
  background-color: #f8f9fb;
  border-radius: 12px;
}

.reference-box span {
  color: #8a96a3;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.reference-box strong {
  color: var(--seatex-navy);
  font-size: 14px;
  word-break: break-all;
}

.route-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fb;
  border-radius: 14px;
}

.route-point {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.route-label {
  color: #8a96a3;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.route-point strong {
  color: var(--seatex-navy);
  font-size: 17px;
}

.route-arrow {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item span {
  color: #8a96a3;
  font-size: 12px;
}

.detail-item strong {
  color: var(--seatex-navy);
  font-size: 14px;
}

.payment-details {
  display: flex;
  flex-direction: column;
}

.payment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 13px 0;
  border-bottom: 1px solid #edf0f3;
  color: #697585;
  font-size: 14px;
}

.payment-row:last-child {
  border-bottom: none;
}

.payment-row strong {
  color: var(--seatex-navy);
}

.amount-paid {
  color: var(--seatex-primary) !important;
  font-size: 17px;
}

.next-steps-card {
  position: sticky;
  top: 100px;
}

.next-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 0;
}

.step-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
}

.next-step strong {
  display: block;
  color: var(--seatex-navy);
  font-size: 14px;
}

.next-step p {
  margin: 4px 0 0;
  color: #74808d;
  font-size: 12px;
  line-height: 1.6;
}

.contact-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  background-color: #f8f9fb;
  border-radius: 12px;
}

.contact-note i {
  margin-top: 2px;
  color: var(--seatex-primary);
}

.contact-note p {
  margin: 0;
  color: #667382;
  font-size: 12px;
  line-height: 1.6;
}

.empty-state {
  max-width: 600px;
  margin: 60px auto;
  padding: 50px 20px;
  background-color: #ffffff;
  border-radius: 18px;
}

.empty-state > i {
  color: #a3adb8;
  font-size: 45px;
}

@media (max-width: 575px) {
  .confirmation-card {
    padding: 18px;
  }

  .confirmation-title {
    font-size: 26px;
  }

  .route-box {
    flex-direction: column;
    align-items: stretch;
  }

  .route-arrow {
    margin: 0 auto;
    transform: rotate(90deg);
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .payment-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .next-steps-card {
    position: static;
  }
}
</style>