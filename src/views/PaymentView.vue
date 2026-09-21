<template>
  <section class="payment-page py-5">
    <div class="container">

      <!-- Page Header -->
      <div class="mb-4">
        <button
          type="button"
          class="btn btn-link text-decoration-none px-0 mb-4"
          @click="goBack"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Back to Booking Summary
        </button>

        <h1 class="page-title mt-3 mb-2">
          Payment
        </h1>

        <p class="text-muted mb-0">
          Complete your payment and upload your payment receipt.
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="isLoading"
        class="text-center py-5"
      >
        <div
          class="spinner-border text-primary"
          role="status"
        ></div>

        <p class="text-muted mt-3 mb-0">
          Loading booking details...
        </p>
      </div>

      <!-- Payment Content -->
      <div
        v-else-if="booking"
        class="row g-4"
      >

        <!-- Left Column -->
        <div class="col-lg-7">

          <!-- Booking Details -->
          <div class="payment-card mb-4">

            <div class="card-header-custom">
              <div>
                <span class="section-label">
                  BOOKING
                </span>

                <h2 class="section-title mb-0">
                  Booking Details
                </h2>
              </div>

              <span class="booking-id">
                #{{ booking._id }}
              </span>
            </div>

            <div class="route-box">

              <div class="route-point">
                <span class="route-label">
                  FROM
                </span>

                <strong>
                  {{ booking.trip?.origin }}
                </strong>
              </div>

              <div class="route-arrow">
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="route-point text-lg-end">
                <span class="route-label">
                  TO
                </span>

                <strong>
                  {{ booking.trip?.destination }}
                </strong>
              </div>

            </div>

            <div class="details-grid mt-4">

              <div class="detail-item">
                <span>
                  Date
                </span>

                <strong>
                  {{ formatDate(booking.trip?.departureDate) }}
                </strong>
              </div>

              <div class="detail-item">
                <span>
                  Departure
                </span>

                <strong>
                  {{ booking.trip?.departureTime }}
                </strong>
              </div>

              <!-- BUS CLASS -->
              <div class="detail-item">
                <span>
                  Bus Class
                </span>

                <strong>
                  {{ booking.trip?.busClass || 'N/A' }}
                </strong>
              </div>

              <div class="detail-item">
                <span>
                  Passengers
                </span>

                <strong>
                  {{ booking.numberOfPassengers }}
                </strong>
              </div>

              <div class="detail-item">
                <span>
                  Total Fare
                </span>

                <strong>
                  ₱{{ formatAmount(totalFare) }}
                </strong>
              </div>

            </div>

          </div>

          <!-- GCash Payment -->
          <div class="payment-card mb-4">

            <div class="card-header-custom">

              <div>
                <span class="section-label">
                  GCASH
                </span>

                <h2 class="section-title mb-0">
                  Pay Using GCash
                </h2>
              </div>

              <i class="bi bi-phone-fill payment-icon"></i>

            </div>

            <div class="gcash-payment-box">

              <p class="text-muted small text-center mb-3">
                Scan the QR code using your GCash app.
              </p>

              <img
                src="/gcash-qr.png"
                alt="SeatEx GCash payment QR code"
                class="gcash-qr"
              />

              <div class="gcash-amount mt-4">

                <span>
                  Amount to Pay
                </span>

                <strong>
                  ₱{{ requiredAmount }}
                </strong>

              </div>

              <div class="gcash-instructions mt-4">

                <div class="instruction-item">
                  <div class="instruction-number">
                    1
                  </div>

                  <p>
                    Open your GCash app and scan the QR code.
                  </p>
                </div>

                <div class="instruction-item">
                  <div class="instruction-number">
                    2
                  </div>

                  <p>
                    Pay the exact amount shown above.
                  </p>
                </div>

                <div class="instruction-item">
                  <div class="instruction-number">
                    3
                  </div>

                  <p>
                    Save a screenshot or copy of your payment receipt.
                  </p>
                </div>

                <div class="instruction-item">
                  <div class="instruction-number">
                    4
                  </div>

                  <p>
                    Upload your payment receipt below.
                  </p>
                </div>

              </div>

            </div>

          </div>

          <!-- Payment Type -->
          <div class="payment-card mb-4">

            <div class="card-header-custom">

              <div>
                <span class="section-label">
                  PAYMENT TYPE
                </span>

                <h2 class="section-title mb-0">
                  Choose Payment
                </h2>
              </div>

            </div>

            <div class="payment-options">

              <!-- Downpayment -->
              <label
                class="payment-option"
                :class="{
                  selected:
                    paymentType === 'Downpayment'
                }"
              >

                <input
                  v-model="paymentType"
                  type="radio"
                  value="Downpayment"
                />

                <div class="payment-option-content">

                  <div>
                    <strong>
                      30% Downpayment
                    </strong>

                    <p>
                      Pay 30% of your total booking fare.
                    </p>
                  </div>

                  <span class="payment-option-amount">
                    ₱{{ formatAmount(downpayment) }}
                  </span>

                </div>

              </label>

              <!-- Full Payment -->
              <label
                class="payment-option"
                :class="{
                  selected:
                    paymentType === 'Full Payment'
                }"
              >

                <input
                  v-model="paymentType"
                  type="radio"
                  value="Full Payment"
                />

                <div class="payment-option-content">

                  <div>
                    <strong>
                      Full Payment
                    </strong>

                    <p>
                      Pay the complete booking fare.
                    </p>
                  </div>

                  <span class="payment-option-amount">
                    ₱{{ formatAmount(totalFare) }}
                  </span>

                </div>

              </label>

            </div>

          </div>

          <!-- Upload Payment Proof -->
          <div class="payment-card mb-4">

            <div class="card-header-custom">

              <div>
                <span class="section-label">
                  PAYMENT PROOF
                </span>

                <h2 class="section-title mb-0">
                  Upload Receipt
                </h2>
              </div>

            </div>

            <p class="text-muted small">
              Upload a clear screenshot or photo of your GCash payment receipt.
            </p>

            <input
              ref="fileInput"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              class="form-control"
              @change="handleFileChange"
            />

            <small class="text-muted d-block mt-2">
              Accepted formats: JPG, JPEG, PNG
            </small>

            <!-- Preview -->
            <div
              v-if="previewUrl"
              class="receipt-preview mt-4"
            >

              <p class="preview-label mb-2">
                Receipt Preview
              </p>

              <img
                :src="previewUrl"
                alt="Payment receipt preview"
                class="receipt-image"
              />

            </div>

          </div>

        </div>

        <!-- Right Column -->
        <div class="col-lg-5">

          <div
            class="payment-card summary-card sticky-lg-top"
          >

            <span class="section-label">
              PAYMENT SUMMARY
            </span>

            <h2 class="section-title mt-1">
              Amount Due
            </h2>

            <div class="summary-row">

              <span>
                Total Fare
              </span>

              <strong>
                ₱{{ formatAmount(totalFare) }}
              </strong>

            </div>

            <div class="summary-row">

              <span>
                Downpayment
              </span>

              <strong>
                ₱{{ formatAmount(downpayment) }}
              </strong>

            </div>

            <hr />

            <div class="summary-row amount-row">

              <span>
                Amount to Pay
              </span>

              <strong>
                ₱{{ requiredAmount }}
              </strong>

            </div>

            <div class="payment-note mt-4">

              <i class="bi bi-info-circle-fill"></i>

              <p>
                Please make sure that the amount in your GCash payment matches
                the amount shown above.
              </p>

            </div>

            <button
              type="button"
              class="btn btn-primary w-100 rounded-pill py-3 fw-semibold mt-4"
              :disabled="isSubmitting"
              @click="submitPayment"
            >

              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              <i
                v-else
                class="bi bi-check-circle me-2"
              ></i>

              {{
                isSubmitting
                  ? "Submitting Payment..."
                  : "Submit Payment"
              }}

            </button>

          </div>

        </div>

      </div>

      <!-- No Booking -->
      <div
        v-else
        class="empty-state text-center py-5"
      >

        <i class="bi bi-receipt-cutoff"></i>

        <h2 class="h5 fw-bold mt-3">
          Booking Not Found
        </h2>

        <p class="text-muted">
          We could not load the booking details.
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
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from "vue";

import {
  useRoute,
  useRouter
} from "vue-router";

import { Notyf } from "notyf";

import api from "../api.js";

import {
  useGlobalStore
} from "../stores/global.js";

const route = useRoute();
const router = useRouter();
const store = useGlobalStore();
const notyf = new Notyf();

const bookingId = route.params.bookingId;

const booking = ref(null);
const isLoading = ref(false);
const isSubmitting = ref(false);

const paymentType = ref("Downpayment");

const selectedFile = ref(null);
const previewUrl = ref("");
const fileInput = ref(null);

const totalFare = computed(() => {
  if (!booking.value) {
    return 0;
  }

  return Number(
    booking.value.totalFare || 0
  );
});

const downpayment = computed(() => {
  if (!booking.value) {
    return 0;
  }

  if (
    booking.value.downpaymentAmount !== undefined
  ) {
    return Number(
      booking.value.downpaymentAmount
    );
  }

  return totalFare.value * 0.3;
});

const requiredAmount = computed(() => {
  if (
    paymentType.value ===
    "Full Payment"
  ) {
    return formatAmount(
      totalFare.value
    );
  }

  return formatAmount(
    downpayment.value
  );
});

async function fetchBooking() {
  if (!store.user.token) {
    notyf.error(
      "Please log in to continue."
    );

    router.push("/login");

    return;
  }

  isLoading.value = true;

  try {
    const response = await api.get(
      "/bookings/get-bookings",
      {
        headers: {
          Authorization:
            `Bearer ${store.user.token}`,
        },
      }
    );

    const bookings =
      Array.isArray(response.data)
        ? response.data
        : response.data.bookings || [];

    booking.value =
      bookings.find(
        (item) =>
          String(item._id) ===
          String(bookingId)
      );

    if (!booking.value) {
      notyf.error(
        "Booking not found."
      );
    }

  } catch (error) {

    console.error(
      "Unable to load booking:",
      error
    );

    if (error.response) {

      notyf.error(
        error.response.data.message ||
        "Unable to load booking details."
      );

    } else {

      notyf.error(
        "Unable to connect to the SEATEX server."
      );

    }

  } finally {

    isLoading.value = false;

  }
}

function handleFileChange(event) {
  const file =
    event.target.files[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png"
  ];

  if (!allowedTypes.includes(file.type)) {

    notyf.error(
      "Only JPG, JPEG, and PNG images are allowed."
    );

    selectedFile.value = null;
    previewUrl.value = "";

    if (fileInput.value) {
      fileInput.value.value = "";
    }

    return;
  }

  selectedFile.value = file;

  if (previewUrl.value) {
    URL.revokeObjectURL(
      previewUrl.value
    );
  }

  previewUrl.value =
    URL.createObjectURL(file);
}

async function submitPayment() {

  if (!store.user.token) {

    notyf.error(
      "Please log in to continue."
    );

    router.push("/login");

    return;
  }

  if (!selectedFile.value) {

    notyf.error(
      "Please upload your payment receipt."
    );

    return;
  }

  const expectedAmount =
    paymentType.value ===
    "Full Payment"
      ? totalFare.value
      : downpayment.value;

  if (
    !expectedAmount ||
    expectedAmount <= 0
  ) {

    notyf.error(
      "Unable to determine the payment amount."
    );

    return;
  }

  const formData =
    new FormData();

  formData.append(
    "paymentAmount",
    expectedAmount.toFixed(2)
  );

  formData.append(
    "paymentType",
    paymentType.value
  );

  formData.append(
    "paymentProof",
    selectedFile.value
  );

  isSubmitting.value = true;

  try {

    const response =
      await api.patch(
        `/bookings/${bookingId}/payment-proof`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${store.user.token}`
          }
        }
      );

    notyf.success(
      response.data.message ||
      "Payment proof submitted successfully."
    );

    router.push({
      name: "booking-confirmation",
      params: {
        bookingId
      }
    });

  } catch (error) {

    console.error(
      "Payment error:",
      error
    );

    if (error.response) {

      console.error(
        "Server response:",
        error.response.data
      );

      console.error(
        "Status:",
        error.response.status
      );

      notyf.error(
        error.response.data.message ||
        "Unable to submit payment proof."
      );

    } else {

      console.error(
        "No server response:",
        error
      );

      notyf.error(
        "Unable to connect to the SEATEX server."
      );

    }

  } finally {

    isSubmitting.value = false;

  }
}

function formatAmount(amount) {
  return Number(
    amount || 0
  ).toLocaleString(
    "en-PH",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
}

function formatDate(date) {

  if (!date) {
    return "N/A";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
}

onMounted(() => {
  fetchBooking();
});

onBeforeUnmount(() => {

  if (previewUrl.value) {

    URL.revokeObjectURL(
      previewUrl.value
    );

  }

});

function goBack() {

  if (
    booking.value?.trip?._id
  ) {

    router.push({
      name: "booking-summary",

      params: {
        tripId:
          booking.value.trip._id
      },

      query: {
        passengers:
          booking.value
            .numberOfPassengers || 1
      }
    });

    return;
  }

  router.push({
    name: "trips"
  });
}
</script>

<style scoped>
.payment-page {
  background-color: #f8f9fb;
  min-height: calc(100vh - 80px);
}

.back-link {
  color: var(--seatex-primary);
  font-size: 14px;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline !important;
}

.page-title {
  color: var(--seatex-navy);
  font-size: 32px;
  font-weight: 800;
}

.payment-card {
  background-color: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 18px;
  padding: 24px;
  box-shadow:
    0 4px 18px rgba(20, 34, 51, 0.04);
}

.card-header-custom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.section-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--seatex-primary);
}

.section-title {
  color: var(--seatex-navy);
  font-size: 20px;
  font-weight: 800;
}

.booking-id {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #6c757d;
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
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #8a96a3;
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
  border-radius: 50%;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
  flex-shrink: 0;
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
  font-size: 12px;
  color: #8a96a3;
}

.detail-item strong {
  color: var(--seatex-navy);
  font-size: 14px;
}

.payment-icon {
  color: var(--seatex-primary);
  font-size: 24px;
}

.gcash-payment-box {
  padding: 24px;
  background-color: #f8f9fb;
  border-radius: 16px;
  border: 1px solid #e5e9ef;
}

.gcash-qr {
  display: block;
  width: 220px;
  height: 220px;
  object-fit: contain;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #e5e9ef;
}

.gcash-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px;
  background-color: var(--seatex-primary-soft);
  border-radius: 10px;
}

.gcash-amount span {
  font-size: 11px;
  color: #647487;
}

.gcash-amount strong {
  color: var(--seatex-primary);
  font-size: 20px;
}

.gcash-instructions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.instruction-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: var(--seatex-primary);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.instruction-item p {
  margin: 2px 0 0;
  color: #5f6b78;
  font-size: 13px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: block;
  padding: 16px;
  border: 1px solid #dfe4ea;
  border-radius: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.payment-option:hover {
  border-color: var(--seatex-primary);
}

.payment-option.selected {
  border-color: var(--seatex-primary);
  background-color: var(--seatex-primary-soft);
}

.payment-option input {
  display: none;
}

.payment-option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.payment-option-content strong {
  display: block;
  color: var(--seatex-navy);
  font-size: 14px;
}

.payment-option-content p {
  margin: 4px 0 0;
  color: #7a8694;
  font-size: 12px;
}

.payment-option-amount {
  color: var(--seatex-primary);
  font-weight: 800;
  white-space: nowrap;
}

.form-control {
  min-height: 46px;
  border-radius: 10px;
  border-color: #dfe4ea;
}

.form-control:focus {
  border-color: var(--seatex-primary);
  box-shadow:
    0 0 0 0.2rem rgba(13, 110, 253, 0.1);
}

.preview-label {
  color: var(--seatex-navy);
  font-size: 13px;
  font-weight: 700;
}

.receipt-preview {
  padding: 14px;
  background-color: #f8f9fb;
  border: 1px solid #e5e9ef;
  border-radius: 12px;
}

.receipt-image {
  display: block;
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #ffffff;
}

.summary-card {
  top: 100px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  color: #697585;
  font-size: 14px;
}

.summary-row strong {
  color: var(--seatex-navy);
}

.amount-row {
  font-size: 16px;
}

.amount-row strong {
  color: var(--seatex-primary);
  font-size: 22px;
  font-weight: 800;
}

.payment-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  background-color: #f8f9fb;
  border-radius: 12px;
}

.payment-note i {
  color: var(--seatex-primary);
  margin-top: 2px;
}

.payment-note p {
  margin: 0;
  color: #667382;
  font-size: 12px;
  line-height: 1.6;
}

.empty-state {
  background-color: #ffffff;
  border-radius: 18px;
  padding: 50px 20px;
}

.empty-state > i {
  color: #a3adb8;
  font-size: 45px;
}

@media (max-width: 575px) {
  .payment-card {
    padding: 18px;
  }

  .page-title {
    font-size: 27px;
  }

  .route-box {
    flex-direction: column;
    align-items: stretch;
  }

  .route-arrow {
    transform: rotate(90deg);
    margin: 0 auto;
  }

  .text-lg-end {
    text-align: left !important;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .gcash-qr {
    width: 190px;
    height: 190px;
  }

  .payment-option-content {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>