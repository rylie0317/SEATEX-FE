<template>
  <div class="trip-card">

    <!-- HEADER -->
    <div class="trip-card-header">

      <div>
        <span class="trip-class">
          {{ trip.busClass || 'BUS TRIP' }}
        </span>

        <h3 class="mb-0">
          {{ trip.origin }}
          <i class="bi bi-arrow-right mx-2"></i>
          {{ trip.destination }}
        </h3>
      </div>

      <span
        class="seat-badge"
        :class="
          trip.availableSeats > 5
            ? 'seat-available'
            : 'seat-limited'
        "
      >
        <i class="bi bi-person-fill"></i>

        {{ trip.availableSeats }} seats
      </span>

    </div>


    <!-- TRIP DETAILS -->
    <div class="route-box">

      <!-- DATE -->
      <div class="route-location">
        <span class="route-label">
          DEPARTURE DATE
        </span>

        <strong>
          {{ formatDate(trip.departureDate) }}
        </strong>

        <span>
          {{ trip.departureTime }}
        </span>
      </div>


      <!-- MIDDLE -->
      <div class="route-middle">

        <div class="route-line">
          <span></span>
        </div>

      </div>


      <!-- DESTINATION -->
      <div class="route-location route-arrival">

        <span class="route-label">
          DESTINATION
        </span>

        <strong>
          {{ trip.destination }}
        </strong>

        <span>
          {{ trip.availableSeats }} available seats
        </span>

      </div>

    </div>


    <!-- FOOTER -->
    <div class="trip-card-footer">

      <div class="fare-section">

        <span>
          Full Fare
        </span>

        <strong>
          ₱{{ Number(trip.fare).toFixed(2) }}
        </strong>

        <small>
          ₱{{ calculateDownpayment(trip.fare) }}
          / 30% downpayment
        </small>

      </div>


      <button
        type="button"
        class="reserve-button"
        :disabled="trip.availableSeats <= 0"
        @click="handleSelect"
      >

        <span>
          {{
            trip.availableSeats <= 0
              ? 'Fully Booked'
              : 'Reserve Seat'
          }}
        </span>

        <i
          v-if="trip.availableSeats > 0"
          class="bi bi-arrow-right"
        ></i>

      </button>

    </div>

  </div>
</template>


<script setup>
const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])


function handleSelect() {
  emit('select', props.trip)
}


function calculateDownpayment(fare) {
  return (Number(fare) * 0.30).toFixed(2)
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
</script>


<style scoped>

.trip-card {
  display: flex;
  flex-direction: column;

  height: 100%;

  padding: 24px;

  background-color: #ffffff;

  border: 1px solid var(--seatex-border);

  border-radius: 16px;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.trip-card:hover {
  transform: translateY(-3px);

  border-color: #c9daf4;

  box-shadow:
    0 12px 30px rgba(24, 59, 99, 0.08);
}


/* =========================
   HEADER
========================= */

.trip-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 20px;
}

.trip-class {
  display: inline-block;

  margin-bottom: 6px;

  padding: 4px 8px;

  background-color: var(--seatex-primary-soft);

  border-radius: 5px;

  color: var(--seatex-primary);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.6px;

  text-transform: uppercase;
}

.trip-card-header h3 {
  margin: 0;

  color: var(--seatex-navy);

  font-size: 16px;
  font-weight: 700;
}


/* =========================
   SEAT BADGE
========================= */

.seat-badge {
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding: 7px 10px;

  border-radius: 20px;

  font-size: 10px;
  font-weight: 700;
}

.seat-available {
  background-color: #eaf7ef;

  color: #16834b;
}

.seat-limited {
  background-color: #fff0f0;

  color: #c0392b;
}


/* =========================
   ROUTE
========================= */

.route-box {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    110px
    minmax(0, 1fr);

  align-items: center;

  gap: 10px;

  padding: 18px;

  background-color: #f8faff;

  border: 1px solid #edf1f6;

  border-radius: 12px;
}

.route-location {
  min-width: 0;
}

.route-location span {
  display: block;

  color: var(--seatex-muted);

  font-size: 11px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-location .route-label {
  margin-bottom: 4px;

  color: var(--seatex-subtle);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.7px;
}

.route-location strong {
  display: block;

  margin-bottom: 4px;

  color: var(--seatex-navy);

  font-size: 16px;
  font-weight: 800;
}

.route-arrival {
  text-align: right;
}


/* =========================
   ROUTE MIDDLE
========================= */

.route-middle {
  text-align: center;

  color: var(--seatex-muted);

  font-size: 10px;
}

.route-line {
  position: relative;

  height: 18px;

  margin: 4px 0;
}

.route-line::before {
  content: '';

  position: absolute;

  top: 50%;
  left: 0;
  right: 0;

  border-top: 2px dashed #cfd8e3;
}

.route-line::after {
  content: '→';

  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -55%);

  padding: 0 5px;

  background-color: #f8faff;

  color: var(--seatex-primary);

  font-size: 14px;
  font-weight: 700;
}

.route-middle small {
  font-size: 9px;
}


/* =========================
   FOOTER
========================= */

.trip-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-top: auto;
  padding-top: 18px;

  border-top: 1px solid var(--seatex-border);
}

.fare-section {
  display: flex;
  flex-direction: column;
}

.fare-section span {
  color: var(--seatex-muted);

  font-size: 10px;
}

.fare-section strong {
  color: var(--seatex-navy);

  font-size: 19px;
  font-weight: 800;
}

.fare-section small {
  margin-top: 2px;

  color: var(--seatex-primary);

  font-size: 10px;
}


/* =========================
   RESERVE BUTTON
========================= */

.reserve-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  min-height: 42px;

  padding: 0 17px;

  background-color: var(--seatex-primary);

  border: none;
  border-radius: 8px;

  color: #ffffff;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.reserve-button:hover:not(:disabled) {

  transform: translateY(-1px);
}

.reserve-button:disabled {
  background-color: #d7dee8;

  color: #7b8795;

  cursor: not-allowed;
}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 576px) {

  .trip-card {
    padding: 20px;
  }

  .trip-card-header {
    flex-direction: column;
  }

  .route-box {
    grid-template-columns: 1fr;

    gap: 15px;
  }

  .route-arrival {
    text-align: left;
  }

  .route-middle {
    order: 3;
  }

  .trip-card-footer {
    align-items: stretch;

    flex-direction: column;
  }

  .reserve-button {
    width: 100%;
  }

}

</style>