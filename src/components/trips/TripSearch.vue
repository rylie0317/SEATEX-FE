<template>
  <div class="search-card">

    <form @submit.prevent="submitSearch">

      <!-- SEARCH FIELDS -->
      <div class="search-fields">

        <!-- ORIGIN -->
        <div class="search-field">

          <label class="input-label">
            ORIGIN
          </label>

          <div class="input-box">

            <i class="bi bi-geo-alt"></i>

            <input
              v-model="search.origin"
              type="text"
              class="form-control"
              placeholder="Enter origin"
              required
            />

          </div>

        </div>


        <!-- SWAP -->
        <div class="swap-container">

          <button
            type="button"
            class="swap-icon-btn"
            title="Swap locations"
            @click="swapLocations"
          >

            <i class="bi bi-arrow-left-right"></i>

          </button>

        </div>


        <!-- DESTINATION -->
        <div class="search-field">

          <label class="input-label">
            DESTINATION
          </label>

          <div class="input-box">

            <i class="bi bi-pin-map"></i>

            <input
              v-model="search.destination"
              type="text"
              class="form-control"
              placeholder="Enter destination"
              required
            />

          </div>

        </div>


        <!-- DATE -->
        <div class="search-field">

          <label class="input-label">
            DEPARTURE DATE
          </label>

          <div class="input-box">

            <i class="bi bi-calendar3"></i>

            <input
              v-model="search.departureDate"
              type="date"
              class="form-control"
              required
            />

          </div>

        </div>

      </div>


      <!-- SEARCH FOOTER -->
      <div class="search-footer">

        <div class="search-note">

          <i class="bi bi-info-circle"></i>

          <span>
            Search available trips by route and date.
          </span>

        </div>


        <button
          type="submit"
          class="search-button"
        >

          <i class="bi bi-search"></i>

          <span>
            Search Trips
          </span>

        </button>

      </div>

    </form>

  </div>
</template>


<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['search'])

const search = reactive({
  origin: '',
  destination: '',
  departureDate: ''
})


function swapLocations() {
  const temp = search.origin

  search.origin = search.destination

  search.destination = temp
}


function submitSearch() {
  emit('search', {
    origin: search.origin.trim(),

    destination:
      search.destination.trim(),

    departureDate:
      search.departureDate
  })
}
</script>


<style scoped>

/* =========================================================
   SEARCH CARD
========================================================= */

.search-card {
  width: 100%;
  max-width: 1050px;

  margin: 0 auto;

  padding: 18px 22px;

  background-color: #ffffff;

  border: 1px solid var(--seatex-border);

  border-radius: 14px;

  box-shadow:
    0 8px 22px rgba(24, 59, 99, 0.06);
}


/* =========================================================
   SEARCH FIELDS
========================================================= */

.search-fields {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    38px
    minmax(0, 1fr)
    minmax(180px, 0.9fr);

  align-items: end;

  gap: 10px;
}

.search-field {
  min-width: 0;
}


.input-label {
  display: block;

  margin-bottom: 5px;

  color: var(--seatex-subtle);

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.8px;
}


/* =========================================================
   INPUT BOX
========================================================= */

.input-box {
  display: flex;

  align-items: center;

  height: 42px;

  padding: 0 11px;

  background-color: var(--seatex-primary-soft);

  border: 1px solid #d4e2fa;

  border-radius: 9px;
}

.input-box > i {
  flex-shrink: 0;

  margin-right: 8px;

  color: var(--seatex-primary);

  font-size: 15px;
}


.input-box .form-control {
  min-width: 0;

  height: 100%;

  padding: 0;

  background-color: transparent;

  border: none;

  color: var(--seatex-text);

  font-size: 12px;

  font-weight: 600;
}

.input-box .form-control:focus {
  background-color: transparent;

  border: none;

  box-shadow: none;
}

.input-box .form-control::placeholder {
  color: var(--seatex-subtle);

  font-weight: 400;
}


/* =========================================================
   SWAP BUTTON
========================================================= */

.swap-container {
  display: flex;

  align-items: center;

  justify-content: center;

  padding-bottom: 2px;
}

.swap-icon-btn {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 34px;

  height: 34px;

  padding: 0;

  background-color: #ffffff;

  border: 1px solid var(--seatex-border);

  border-radius: 50%;

  color: var(--seatex-primary);

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.swap-icon-btn:hover {
  background-color: var(--seatex-primary-soft);

  border-color: var(--seatex-primary);

  transform: rotate(180deg);
}


/* =========================================================
   SEARCH FOOTER
========================================================= */

.search-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-top: 14px;

  padding-top: 12px;

  border-top: 1px solid var(--seatex-border);
}

.search-note {
  display: flex;

  align-items: center;

  gap: 6px;

  color: var(--seatex-muted);

  font-size: 11px;
}

.search-note i {
  color: var(--seatex-primary);
}


/* =========================================================
   SEARCH BUTTON
========================================================= */

.search-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  min-height: 38px;

  padding: 0 19px;

  background-color: var(--seatex-primary);

  border: 1px solid var(--seatex-primary);

  border-radius: 8px;

  color: #ffffff;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}


/*
 * Only the Trip Search button uses this hover state.
 * It does not affect other buttons in the application.
 */

.search-button:hover {
  background-color: var(--seatex-primary);

  border-color: var(--seatex-primary);

  color: #ffffff;

  transform: translateY(-1px);
}


/*
 * Keep the button text white when focused.
 */

.search-button:focus {
  background-color: var(--seatex-primary);

  border-color: var(--seatex-primary);

  color: #ffffff;

  box-shadow: none;
}


/*
 * Keep the same appearance while the button is being clicked.
 */

.search-button:active {
  background-color: var(--seatex-primary);

  border-color: var(--seatex-primary);

  color: #ffffff;

  transform: translateY(0);
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 900px) {

  .search-fields {
    grid-template-columns:
      1fr
      1fr;

    gap: 13px;
  }

  .swap-container {
    display: none;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 576px) {

  .search-card {
    padding: 18px;

    border-radius: 12px;
  }

  .search-fields {
    grid-template-columns: 1fr;
  }

  .search-footer {
    align-items: stretch;

    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .search-note {
    justify-content: center;

    text-align: center;
  }

}

</style>