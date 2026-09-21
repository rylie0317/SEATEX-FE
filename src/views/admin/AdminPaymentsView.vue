<template>
  <section class="admin-payments-page py-5">
    <div class="container">

      <!-- HEADER -->
      <div class="page-header mb-4">
        <span class="section-label">
          ADMIN
        </span>

        <h1 class="page-title mt-2 mb-2">
          Payment Verification
        </h1>

        <p class="text-muted mb-0">
          Review submitted payment proofs and verify customer payments.
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
        ></div>

        <p class="text-muted mt-3 mb-0">
          Loading pending payments...
        </p>
      </div>

      <!-- PENDING PAYMENTS -->
      <div
        v-else-if="bookings.length > 0"
        class="row g-4"
      >

        <div
          v-for="booking in bookings"
          :key="booking._id"
          class="col-12"
        >

          <div class="payment-card">

            <!-- CARD HEADER -->
            <div class="payment-header">

              <div>
                <span class="booking-label">
                  BOOKING REFERENCE
                </span>

                <strong class="booking-id">
                  {{ booking._id }}
                </strong>
              </div>

              <span class="status-badge">
                {{ booking.paymentStatus }}
              </span>

            </div>

            <hr>

            <div class="row g-4">

              <!-- BOOKING DETAILS -->
              <div class="col-lg-7">

                <span class="section-label">
                  BOOKING DETAILS
                </span>

                <div class="route-box mt-2">

                  <div class="route-location">
                    <span>FROM</span>

                    <strong>
                      {{ getTrip(booking)?.origin || 'N/A' }}
                    </strong>
                  </div>

                  <div class="route-arrow">
                    <i class="bi bi-arrow-right"></i>
                  </div>

                  <div class="route-location">
                    <span>TO</span>

                    <strong>
                      {{ getTrip(booking)?.destination || 'N/A' }}
                    </strong>
                  </div>

                </div>

                <div class="details-grid mt-4">

                  <div class="detail-item">
                    <span>Departure Date</span>

                    <strong>
                      {{ formatDate(getTrip(booking)?.departureDate) }}
                    </strong>
                  </div>

                  <div class="detail-item">
                    <span>Departure Time</span>

                    <strong>
                      {{ getTrip(booking)?.departureTime || 'N/A' }}
                    </strong>
                  </div>

                  <div class="detail-item">
                    <span>Bus Class</span>

                    <strong>
                      {{ getTrip(booking)?.busClass || 'N/A' }}
                    </strong>
                  </div>

                  <div class="detail-item">
                    <span>Passengers</span>

                    <strong>
                      {{ booking.numberOfPassengers }}
                    </strong>
                  </div>

                  <div class="detail-item">
                    <span>Total Fare</span>

                    <strong>
                      ₱{{ formatAmount(booking.totalFare) }}
                    </strong>
                  </div>

                </div>

                <!-- CUSTOMER SUBMITTED PAYMENT -->
                <div class="payment-summary mt-4">

                  <div class="summary-row">
                    <span>
                      Customer Payment Type
                    </span>

                    <strong>
                      {{ booking.paymentType || 'N/A' }}
                    </strong>
                  </div>

                  <div class="summary-row">
                    <span>
                      Customer Declared Amount
                    </span>

                    <strong>
                      ₱{{ formatAmount(booking.paymentAmount) }}
                    </strong>
                  </div>

                  <div class="summary-row">
                    <span>
                      Expected Amount
                    </span>

                    <strong class="expected-amount">
                      ₱{{ formatAmount(getExpectedAmount(booking)) }}
                    </strong>
                  </div>

                </div>

              </div>

              <!-- PAYMENT PROOF -->
              <div class="col-lg-5">

                <span class="section-label">
                  PAYMENT PROOF
                </span>

                <div class="proof-box mt-2">

                  <div
                    v-if="getPaymentProofUrl(booking)"
                    class="proof-preview"
                  >

                    <img
                      :src="getPaymentProofUrl(booking)"
                      alt="Customer payment proof"
                      class="proof-image"
                    >

                    <a
                      :href="getPaymentProofUrl(booking)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="view-proof-link"
                    >
                      <i class="bi bi-box-arrow-up-right me-1"></i>
                      Open Full Image
                    </a>

                  </div>

                  <div
                    v-else
                    class="no-proof"
                  >

                    <i class="bi bi-image"></i>

                    <p class="mb-0">
                      Payment proof unavailable.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <!-- ACTIONS -->
            <div class="action-section mt-4 pt-4 border-top">

              <button
                type="button"
                class="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                :disabled="processingBookingId === booking._id"
                @click="openApproveModal(booking)"
              >

                <span
                  v-if="
                    processingBookingId === booking._id &&
                    processingAction === 'approve'
                  "
                  class="spinner-border spinner-border-sm me-2"
                ></span>

                <i
                  v-else
                  class="bi bi-check-circle me-2"
                ></i>

                Approve Payment

              </button>

              <button
                type="button"
                class="btn btn-outline-danger rounded-pill px-4 py-2 fw-semibold"
                :disabled="processingBookingId === booking._id"
                @click="openFailModal(booking)"
              >

                <span
                  v-if="
                    processingBookingId === booking._id &&
                    processingAction === 'fail'
                  "
                  class="spinner-border spinner-border-sm me-2"
                ></span>

                <i
                  v-else
                  class="bi bi-x-circle me-2"
                ></i>

                Fail Payment

              </button>

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
          <i class="bi bi-check2-circle"></i>
        </div>

        <h2 class="h5 fw-bold mt-3">
          No Pending Payments
        </h2>

        <p class="text-muted">
          There are currently no payment proofs waiting for verification.
        </p>

        <button
          type="button"
          class="btn btn-outline-primary rounded-pill px-4"
          @click="loadPendingPayments"
        >
          <i class="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>

      </div>

    </div>

    <!-- APPROVE PAYMENT MODAL -->
    <div
      v-if="showApproveModal"
      class="modal-backdrop-custom"
    >

      <div class="approve-modal">

        <div class="modal-header-custom">

          <div>
            <span class="section-label">
              PAYMENT REVIEW
            </span>

            <h2 class="modal-title mt-1">
              Verify Payment
            </h2>
          </div>

          <button
            type="button"
            class="close-button"
            :disabled="isApproving"
            @click="closeApproveModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>

        <p class="text-muted small">
          Review the payment proof and enter the amount you verified from the receipt.
        </p>

        <!-- EXPECTED AMOUNT -->
        <div class="verification-box mb-3">

          <div class="verification-row">
            <span>
              Expected Amount
            </span>

            <strong>
              ₱{{ formatAmount(getExpectedAmount(selectedBooking)) }}
            </strong>
          </div>

          <div class="verification-row">
            <span>
              Customer Declared
            </span>

            <strong>
              ₱{{ formatAmount(selectedBooking?.paymentAmount) }}
            </strong>
          </div>

        </div>

        <!-- PAYMENT TYPE -->
        <div class="mb-3">

          <label class="form-label fw-semibold">
            Verified Payment Type
          </label>

          <select
            v-model="verifiedPaymentType"
            class="form-select"
            :disabled="isApproving"
          >

            <option value="">
              Select payment type
            </option>

            <option value="Downpayment">
              Downpayment
            </option>

            <option value="Full Payment">
              Full Payment
            </option>

          </select>

        </div>

        <!-- VERIFIED AMOUNT -->
        <div class="mb-3">

          <label class="form-label fw-semibold">
            Verified Amount
          </label>

          <div class="input-group">

            <span class="input-group-text">
              ₱
            </span>

            <input
              v-model="verifiedPaymentAmount"
              type="number"
              min="0"
              step="0.01"
              class="form-control"
              placeholder="Enter amount shown on receipt"
              :disabled="isApproving"
            >

          </div>

          <small class="text-muted">
            Enter the actual amount shown on the customer's payment proof.
          </small>

        </div>

        <!-- VERIFICATION WARNING -->
        <div
          v-if="verifiedPaymentAmount && verifiedPaymentType"
          class="verification-result"
          :class="
            isVerifiedAmountCorrect
              ? 'verification-success'
              : 'verification-danger'
          "
        >

          <i
            :class="
              isVerifiedAmountCorrect
                ? 'bi bi-check-circle-fill'
                : 'bi bi-exclamation-circle-fill'
            "
          ></i>

          <span>
            {{
              isVerifiedAmountCorrect
                ? 'The verified amount matches the required amount.'
                : `The verified amount does not match the required amount of ₱${formatAmount(getExpectedAmountForType(selectedBooking, verifiedPaymentType))}.`
            }}
          </span>

        </div>

        <div class="modal-actions">

          <button
            type="button"
            class="btn btn-light rounded-pill px-4"
            :disabled="isApproving"
            @click="closeApproveModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-primary rounded-pill px-4 fw-semibold"
            :disabled="
              isApproving ||
              !verifiedPaymentType ||
              !verifiedPaymentAmount ||
              !isVerifiedAmountCorrect
            "
            @click="approvePayment"
          >

            <span
              v-if="isApproving"
              class="spinner-border spinner-border-sm me-2"
            ></span>

            {{ isApproving ? 'Verifying...' : 'Approve Payment' }}

          </button>

        </div>

      </div>

    </div>

    <!-- FAIL PAYMENT MODAL -->
    <div
      v-if="showFailModal"
      class="modal-backdrop-custom"
    >

      <div class="fail-modal">

        <div class="modal-header-custom">

          <div>
            <span class="section-label">
              PAYMENT REVIEW
            </span>

            <h2 class="modal-title mt-1">
              Fail Payment
            </h2>
          </div>

          <button
            type="button"
            class="close-button"
            :disabled="isFailing"
            @click="closeFailModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>

        <p class="text-muted small">
          Select the reason why this payment cannot be approved.
        </p>

        <div class="mb-3">

          <label class="form-label fw-semibold">
            Failure Reason
          </label>

          <select
            v-model="failureReason"
            class="form-select"
            :disabled="isFailing"
          >

            <option value="">
              Select a reason
            </option>

            <option
              v-for="reason in failureReasons"
              :key="reason"
              :value="reason"
            >
              {{ reason }}
            </option>

          </select>

        </div>

        <div
          v-if="failureReason === 'Other'"
          class="mb-3"
        >

          <label class="form-label fw-semibold">
            Other Reason
          </label>

          <textarea
            v-model="otherReason"
            class="form-control"
            rows="3"
            placeholder="Enter the reason..."
            :disabled="isFailing"
          ></textarea>

        </div>

        <div class="modal-actions">

          <button
            type="button"
            class="btn btn-light rounded-pill px-4"
            :disabled="isFailing"
            @click="closeFailModal"
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-danger rounded-pill px-4 fw-semibold"
            :disabled="isFailing"
            @click="failPayment"
          >

            <span
              v-if="isFailing"
              class="spinner-border spinner-border-sm me-2"
            ></span>

            {{ isFailing ? 'Processing...' : 'Confirm Failure' }}

          </button>

        </div>

      </div>

    </div>

  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  Notyf
} from 'notyf'

import api from '../../api.js'

import {
  useGlobalStore
} from '../../stores/global.js'


const router = useRouter()

const store = useGlobalStore()

const notyf = new Notyf()


const bookings = ref([])

const isLoading = ref(false)


const processingBookingId = ref(null)

const processingAction = ref(null)


/* ==========================================
   APPROVE PAYMENT
========================================== */

const showApproveModal = ref(false)

const selectedBooking = ref(null)

const verifiedPaymentAmount = ref('')

const verifiedPaymentType = ref('')

const isApproving = ref(false)


/* ==========================================
   FAIL PAYMENT
========================================== */

const showFailModal = ref(false)

const failureReason = ref('')

const otherReason = ref('')

const isFailing = ref(false)


const failureReasons = [
  'Incorrect Payment Amount',
  'Payment Proof Unclear',
  'Payment Proof Does Not Match',
  'Transaction Not Found',
  'Duplicate Payment Proof',
  'Invalid Payment',
  'Other'
]


/* ==========================================
   LOAD PENDING PAYMENTS
========================================== */

async function loadPendingPayments() {

  if (!store.user.token) {

    notyf.error(
      'Please log in to continue.'
    )

    router.push({
      name: 'login'
    })

    return
  }


  if (!store.user.isAdmin) {

    notyf.error(
      'Admin access required.'
    )

    router.push({
      name: 'home'
    })

    return
  }


  isLoading.value = true


  try {

    const response = await api.get(
      '/bookings/admin/pending',
      {
        headers: {
          Authorization:
            `Bearer ${store.user.token}`
        }
      }
    )


    bookings.value =
      Array.isArray(response.data)
        ? response.data
        : response.data.bookings || []


    bookings.value.sort(
      (a, b) =>
        new Date(b.bookedOn) -
        new Date(a.bookedOn)
    )


  } catch (error) {

    console.error(
      'Unable to load pending payments:',
      error
    )


    if (
      error.response?.status === 404
    ) {

      bookings.value = []

      return
    }


    notyf.error(
      error.response?.data?.message ||
      'Unable to load pending payments.'
    )


  } finally {

    isLoading.value = false

  }

}


/* ==========================================
   GET TRIP
========================================== */

function getTrip(booking) {

  if (!booking) {
    return null
  }

  return booking.trip || null

}


/* ==========================================
   EXPECTED AMOUNT
========================================== */

function getExpectedAmount(booking) {

  if (!booking) {
    return 0
  }


  if (
    booking.paymentType ===
    'Full Payment'
  ) {

    return Number(
      booking.totalFare || 0
    )

  }


  if (
    booking.paymentType ===
    'Downpayment'
  ) {

    return Number(
      booking.downpaymentAmount || 0
    )

  }


  return 0

}


/* ==========================================
   EXPECTED AMOUNT BASED ON TYPE
========================================== */

function getExpectedAmountForType(
  booking,
  paymentType
) {

  if (!booking) {
    return 0
  }


  if (
    paymentType ===
    'Full Payment'
  ) {

    return Number(
      booking.totalFare || 0
    )

  }


  if (
    paymentType ===
    'Downpayment'
  ) {

    return Number(
      booking.downpaymentAmount || 0
    )

  }


  return 0

}


/* ==========================================
   VERIFIED AMOUNT CHECK
========================================== */

const isVerifiedAmountCorrect =
  computed(() => {

    if (
      !selectedBooking.value ||
      !verifiedPaymentType.value ||
      verifiedPaymentAmount.value === ''
    ) {

      return false

    }


    const verifiedAmount =
      Number(
        verifiedPaymentAmount.value
      )


    const requiredAmount =
      getExpectedAmountForType(
        selectedBooking.value,
        verifiedPaymentType.value
      )


    if (
      !Number.isFinite(
        verifiedAmount
      ) ||
      verifiedAmount <= 0
    ) {

      return false

    }


    return (
      Math.abs(
        verifiedAmount -
        requiredAmount
      ) <= 0.01
    )

  })


/* ==========================================
   OPEN APPROVE MODAL
========================================== */

function openApproveModal(booking) {

  selectedBooking.value = booking

  verifiedPaymentType.value =
    booking.paymentType || ''

  verifiedPaymentAmount.value = ''

  showApproveModal.value = true

}


/* ==========================================
   CLOSE APPROVE MODAL
========================================== */

function closeApproveModal() {

  if (isApproving.value) {
    return
  }


  showApproveModal.value = false

  selectedBooking.value = null

  verifiedPaymentAmount.value = ''

  verifiedPaymentType.value = ''

}


/* ==========================================
   APPROVE PAYMENT
========================================== */

async function approvePayment() {

  if (!selectedBooking.value) {
    return
  }


  if (
    !store.user.token ||
    !store.user.isAdmin
  ) {

    notyf.error(
      'Admin access required.'
    )

    return
  }


  if (!verifiedPaymentType.value) {

    notyf.error(
      'Please select the verified payment type.'
    )

    return
  }


  const verifiedAmount =
    Number(
      verifiedPaymentAmount.value
    )


  if (
    !Number.isFinite(
      verifiedAmount
    ) ||
    verifiedAmount <= 0
  ) {

    notyf.error(
      'Please enter the verified payment amount.'
    )

    return
  }


  const requiredAmount =
    getExpectedAmountForType(
      selectedBooking.value,
      verifiedPaymentType.value
    )


  if (
    Math.abs(
      verifiedAmount -
      requiredAmount
    ) > 0.01
  ) {

    notyf.error(
      `Payment amount must be exactly ₱${formatAmount(requiredAmount)} for ${verifiedPaymentType.value}.`
    )

    return
  }


  const confirmed =
    window.confirm(
      'Have you verified that the payment proof shows the correct amount and payment type?'
    )


  if (!confirmed) {
    return
  }


  isApproving.value = true

  processingBookingId.value =
    selectedBooking.value._id

  processingAction.value =
    'approve'


  try {

    const response =
      await api.patch(

        `/bookings/admin/${selectedBooking.value._id}/approve-payment`,

        {
          paymentAmount:
            verifiedAmount,

          paymentType:
            verifiedPaymentType.value
        },

        {
          headers: {
            Authorization:
              `Bearer ${store.user.token}`
          }
        }

      )


    notyf.success(
      response.data.message ||
      'Payment approved successfully.'
    )


    const approvedBookingId =
      selectedBooking.value._id


    bookings.value =
      bookings.value.filter(
        item =>
          item._id !==
          approvedBookingId
      )


    closeApproveModal()


  } catch (error) {

    console.error(
      'Unable to approve payment:',
      error
    )


    notyf.error(
      error.response?.data?.message ||
      'Unable to approve payment.'
    )


  } finally {

    isApproving.value = false

    processingBookingId.value = null

    processingAction.value = null

  }

}


/* ==========================================
   OPEN FAIL MODAL
========================================== */

function openFailModal(booking) {

  selectedBooking.value =
    booking

  failureReason.value = ''

  otherReason.value = ''

  showFailModal.value = true

}


/* ==========================================
   CLOSE FAIL MODAL
========================================== */

function closeFailModal() {

  if (isFailing.value) {
    return
  }


  showFailModal.value = false

  selectedBooking.value = null

  failureReason.value = ''

  otherReason.value = ''

}


/* ==========================================
   FAIL PAYMENT
========================================== */

async function failPayment() {

  if (!selectedBooking.value) {
    return
  }


  if (
    !store.user.token ||
    !store.user.isAdmin
  ) {

    notyf.error(
      'Admin access required.'
    )

    return
  }


  if (!failureReason.value) {

    notyf.error(
      'Please select a failure reason.'
    )

    return
  }


  if (
    failureReason.value ===
    'Other' &&
    !otherReason.value.trim()
  ) {

    notyf.error(
      'Please provide a reason when Other is selected.'
    )

    return
  }


  const confirmed =
    window.confirm(
      'Are you sure you want to mark this payment as failed?'
    )


  if (!confirmed) {
    return
  }


  isFailing.value = true

  processingBookingId.value =
    selectedBooking.value._id

  processingAction.value =
    'fail'


  try {

    const payload = {

      failureReason:
        failureReason.value

    }


    if (
      failureReason.value ===
      'Other'
    ) {

      payload.otherReason =
        otherReason.value.trim()

    }


    const response =
      await api.patch(

        `/bookings/admin/${selectedBooking.value._id}/fail-payment`,

        payload,

        {
          headers: {
            Authorization:
              `Bearer ${store.user.token}`
          }
        }

      )


    if (
      response.data.emailSent
    ) {

      notyf.success(
        'Payment marked as failed and customer notified.'
      )

    } else {

      notyf.success(
        'Payment marked as failed.'
      )

    }


    const failedBookingId =
      selectedBooking.value._id


    bookings.value =
      bookings.value.filter(
        item =>
          item._id !==
          failedBookingId
      )


    closeFailModal()


  } catch (error) {

    console.error(
      'Unable to fail payment:',
      error
    )


    notyf.error(
      error.response?.data?.message ||
      'Unable to fail payment.'
    )


  } finally {

    isFailing.value = false

    processingBookingId.value = null

    processingAction.value = null

  }

}


/* ==========================================
   PAYMENT PROOF URL
========================================== */

function getPaymentProofUrl(booking) {

  if (!booking?.paymentProof) {
    return ''
  }


  const proofPath =
    booking.paymentProof
      .replace(/\\/g, '/')


  const normalizedPath =
    proofPath.startsWith('/')
      ? proofPath
      : `/${proofPath}`


  return (
    `${import.meta.env.VITE_SEATEX_API}` +
    normalizedPath
  )

}


/* ==========================================
   FORMAT AMOUNT
========================================== */

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


/* ==========================================
   FORMAT DATE
========================================== */

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


/* ==========================================
   INITIAL LOAD
========================================== */

onMounted(() => {

  loadPendingPayments()

})
</script>

<style scoped>
.admin-payments-page {
  min-height: calc(100vh - 80px);
  background-color: #f8f9fb;
}

.page-header {
  max-width: 760px;
}

.page-title {
  color: var(--seatex-navy);
  font-size: 32px;
  font-weight: 800;
}

.section-label {
  display: inline-block;
  color: var(--seatex-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.payment-card {
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(20, 34, 51, 0.04);
}

.payment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.booking-label {
  display: block;
  margin-bottom: 5px;
  color: #8a96a3;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.booking-id {
  color: var(--seatex-navy);
  font-size: 14px;
  word-break: break-all;
}

.status-badge {
  padding: 7px 13px;
  border-radius: 20px;
  background-color: #fff3cd;
  color: #856404;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.route-box {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px;
  background-color: #f8f9fb;
  border-radius: 14px;
}

.route-location {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.route-location span {
  color: #8a96a3;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.route-location strong {
  color: var(--seatex-navy);
  font-size: 16px;
}

.route-arrow {
  width: 36px;
  height: 36px;
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
  font-size: 11px;
}

.detail-item strong {
  color: var(--seatex-navy);
  font-size: 14px;
}

.payment-summary {
  padding: 15px;
  background-color: #f8f9fb;
  border-radius: 12px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 7px 0;
  color: #697585;
  font-size: 13px;
}

.summary-row strong {
  color: var(--seatex-navy);
}

.expected-amount {
  color: var(--seatex-primary) !important;
  font-size: 16px;
}

.proof-box {
  min-height: 280px;
  padding: 14px;
  background-color: #f8f9fb;
  border: 1px solid #e5e9ef;
  border-radius: 14px;
}

.proof-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.proof-image {
  display: block;
  width: 100%;
  max-height: 330px;
  object-fit: contain;
  background-color: #ffffff;
  border-radius: 10px;
}

.view-proof-link {
  color: var(--seatex-primary);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.view-proof-link:hover {
  text-decoration: underline;
}

.no-proof {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9aa5b1;
  text-align: center;
}

.no-proof i {
  font-size: 35px;
  margin-bottom: 10px;
}

.action-section {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.empty-state {
  max-width: 600px;
  margin: 60px auto;
  padding: 55px 20px;
  background-color: #ffffff;
  border-radius: 18px;
}

.empty-icon {
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 50%;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
  font-size: 28px;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(15, 25, 35, 0.5);
  overflow-y: auto;
}

.approve-modal,
.fail-modal {
  width: 100%;
  max-width: 520px;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header-custom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.modal-title {
  color: var(--seatex-navy);
  font-size: 21px;
  font-weight: 800;
}

.close-button {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: #f1f3f5;
  color: #687583;
}

.close-button:hover {
  background-color: #e9ecef;
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.verification-box {
  padding: 15px;
  background-color: #f8f9fb;
  border: 1px solid #e5e9ef;
  border-radius: 12px;
}

.verification-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 6px 0;
  color: #697585;
  font-size: 13px;
}

.verification-row strong {
  color: var(--seatex-navy);
}

.verification-result {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 18px;
  border-radius: 10px;
  font-size: 13px;
}

.verification-success {
  background-color: #eaf7ee;
  color: #1d6b35;
}

.verification-danger {
  background-color: #fff0f0;
  color: #b42318;
}

.verification-result i {
  margin-top: 2px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

@media (max-width: 575px) {
  .payment-card {
    padding: 18px;
  }

  .page-title {
    font-size: 27px;
  }

  .payment-header {
    align-items: flex-start;
    flex-direction: column;
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

  .action-section {
    flex-direction: column;
  }

  .action-section .btn {
    width: 100%;
  }

  .verification-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 2px;
  }
}
</style>