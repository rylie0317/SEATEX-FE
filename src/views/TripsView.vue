<template>

  <div class="seatex-trips-page">

    <!-- PAGE HEADER -->
    <section class="seatex-trips-header">

      <div class="container">

        <div class="seatex-page-header">

          <span class="seatex-badge-label">
            AVAILABLE TRIPS
          </span>

          <h1 class="seatex-page-title">
            Find Your Bus Trip
          </h1>

          <p class="seatex-page-description">
            Search and compare available bus trips based on your
            preferred route and departure date.
          </p>

        </div>

      </div>

    </section>


    <!-- SEARCH -->
    <section class="seatex-search-section">

      <div class="container">

        <TripSearch
          :initial-origin="searchCriteria.origin"
          :initial-destination="searchCriteria.destination"
          :initial-departure-date="searchCriteria.departureDate"
          @search="handleSearch"
        />

      </div>

    </section>


    <!-- RESULTS -->
    <section class="seatex-results-section">

      <div class="container">

        <!-- FILTER / SORT HEADER -->
        <div
          v-if="hasSearchCriteria"
          class="results-header mb-4"
        >

          <div>

            <span class="results-label">
              SEARCH RESULTS
            </span>

            <h2 class="results-title">
              Available Trips
            </h2>

            <p class="results-description mb-0">
              Showing trips that match your search.
            </p>

          </div>


          <div class="sort-wrapper">

            <label
              for="sortTrips"
              class="sort-label"
            >
              SORT BY
            </label>

            <select
              id="sortTrips"
              v-model="sortOption"
              class="form-select"
            >

              <option value="recommended">
                Recommended
              </option>

              <option value="earliest">
                Earliest Departure
              </option>

              <option value="latest">
                Latest Departure
              </option>

              <option value="lowest-price">
                Lowest Price
              </option>

              <option value="highest-price">
                Highest Price
              </option>

              <option value="fewest-seats">
                Fewest Seats
              </option>

              <option value="most-seats">
                Most Seats
              </option>

            </select>

          </div>

        </div>


        <!-- SEARCH SUMMARY -->
        <div
          v-if="hasSearchCriteria"
          class="search-summary mb-4"
        >

          <div class="search-summary-item">

            <i class="bi bi-geo-alt"></i>

            <div>

              <span>
                ROUTE
              </span>

              <strong>
                {{ searchCriteria.origin }}
                →
                {{ searchCriteria.destination }}
              </strong>

            </div>

          </div>


          <div class="search-summary-item">

            <i class="bi bi-calendar3"></i>

            <div>

              <span>
                DEPARTURE DATE
              </span>

              <strong>
                {{ formatDate(searchCriteria.departureDate) }}
              </strong>

            </div>

          </div>


          <button
            type="button"
            class="btn btn-outline-primary rounded-pill"
            @click="clearSearch"
          >

            <i class="bi bi-x-circle me-2"></i>

            View All Trips

          </button>

        </div>


        <!-- FILTERS -->
        <div
          v-if="hasSearchCriteria"
          class="row g-4"
        >

          <!-- SIDEBAR -->
          <div class="col-12 col-lg-3">

            <div class="filter-card">

              <div class="filter-header">

                <h3>
                  Filters
                </h3>

                <button
                  type="button"
                  class="btn btn-sm btn-link p-0"
                  @click="resetFilters"
                >
                  Reset
                </button>

              </div>


              <!-- DEPARTURE TIME -->
              <div class="filter-group">

                <label
                  for="departureTime"
                  class="filter-label"
                >
                  Departure Time
                </label>

                <select
                  id="departureTime"
                  v-model="selectedDepartureTime"
                  class="form-select"
                >

                  <option value="">
                    Any Time
                  </option>

                  <option value="morning">
                    Morning
                  </option>

                  <option value="afternoon">
                    Afternoon
                  </option>

                  <option value="evening">
                    Evening
                  </option>

                  <option value="night">
                    Night
                  </option>

                </select>

              </div>


              <!-- MAX PRICE -->
              <div class="filter-group">

                <label
                  for="maxPrice"
                  class="filter-label"
                >
                  Maximum Fare
                </label>

                <select
                  id="maxPrice"
                  v-model="selectedMaxPrice"
                  class="form-select"
                >

                  <option value="">
                    Any Price
                  </option>

                  <option value="500">
                    ₱500
                  </option>

                  <option value="750">
                    ₱750
                  </option>

                  <option value="1000">
                    ₱1,000
                  </option>

                  <option value="1500">
                    ₱1,500
                  </option>

                  <option value="2000">
                    ₱2,000
                  </option>

                </select>

              </div>


              <!-- BUS CLASS -->
              <div class="filter-group">

                <label
                  for="busClass"
                  class="filter-label"
                >
                  Bus Class
                </label>

                <select
                  id="busClass"
                  v-model="selectedBusClass"
                  class="form-select"
                >

                  <option value="">
                    All Bus Classes
                  </option>

                  <option
                    v-for="busClass in busClasses"
                    :key="busClass"
                    :value="busClass"
                  >
                    {{ busClass }}
                  </option>

                </select>

              </div>

            </div>

          </div>


          <!-- TRIPS -->
          <div class="col-12 col-lg-9">

            <!-- LOADING -->
            <div
              v-if="isLoading"
              class="seatex-trips-state"
            >

              <div class="spinner-border text-primary">
              </div>

              <h3>
                Finding trips...
              </h3>

              <p>
                Please wait while we search for available trips.
              </p>

            </div>


            <!-- ERROR -->
            <div
              v-else-if="errorMessage"
              class="seatex-trips-state"
            >

              <div class="seatex-empty-icon">

                <i class="bi bi-exclamation-circle"></i>

              </div>

              <h3>
                Unable to Load Trips
              </h3>

              <p>
                {{ errorMessage }}
              </p>

              <button
                type="button"
                class="btn btn-primary rounded-pill px-4"
                @click="loadTrips"
              >

                <i class="bi bi-arrow-clockwise me-2"></i>

                Try Again

              </button>

            </div>


            <!-- NO RESULTS -->
            <div
              v-else-if="displayedTrips.length === 0"
              class="seatex-trips-state seatex-no-results"
            >

              <div class="seatex-empty-icon">

                <i class="bi bi-bus-front"></i>

              </div>

              <h3>
                No trips found
              </h3>

              <p>
                No available trips match your search
                and selected filters.
              </p>

              <button
                type="button"
                class="btn btn-outline-primary rounded-pill px-4"
                @click="resetFilters"
              >

                <i class="bi bi-arrow-counterclockwise me-2"></i>

                Reset Filters

              </button>

            </div>


            <!-- TRIP RESULTS -->
            <div
              v-else
              class="trip-results"
            >

              <TripCard
                v-for="trip in displayedTrips"
                :key="trip._id"
                :trip="trip"
                @select="handleTripSelect"
              />

            </div>

          </div>

        </div>


        <!-- INITIAL STATE -->
        <div
          v-else
          class="seatex-trips-state"
        >

          <div class="seatex-empty-icon">

            <i class="bi bi-search"></i>

          </div>

          <h3>
            Search for a trip
          </h3>

          <p>
            Enter your origin, destination, and travel date
            above to see available trips.
          </p>

        </div>

      </div>

    </section>

  </div>

</template>


<script setup>

import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import { Notyf } from 'notyf'

import api from '../api.js'

import TripSearch from '../components/trips/TripSearch.vue'

import TripCard from '../components/trips/TripCard.vue'


const route = useRoute()

const router = useRouter()

const notyf = new Notyf()


// ==========================================
// TRIP DATA
// ==========================================

const trips = ref([])

const isLoading = ref(false)

const errorMessage = ref('')


// ==========================================
// SEARCH
// ==========================================

const searchCriteria = reactive({

  origin: '',

  destination: '',

  departureDate: ''

})


const hasSearchCriteria = computed(() => {

  return (
    !!searchCriteria.origin &&
    !!searchCriteria.destination &&
    !!searchCriteria.departureDate
  )

})


// ==========================================
// FILTERS
// ==========================================

const selectedDepartureTime = ref('')

const selectedMaxPrice = ref('')

const selectedBusClass = ref('')


const busClasses = [

  'Regular Aircon',

  'Deluxe',

  'First Class',

  'Sleeper'

]


// ==========================================
// SORTING
// ==========================================

const sortOption = ref('recommended')


// ==========================================
// INITIAL LOAD
// ==========================================

onMounted(async () => {

  syncSearchFromRoute()

  await loadTrips()

})


// ==========================================
// SYNC URL SEARCH
// ==========================================

function syncSearchFromRoute() {

  searchCriteria.origin =
    String(route.query.origin || '')

  searchCriteria.destination =
    String(route.query.destination || '')

  searchCriteria.departureDate =
    String(route.query.departureDate || '')

}


// ==========================================
// SEARCH
// ==========================================

function handleSearch(searchData) {

  searchCriteria.origin =
    searchData.origin || ''

  searchCriteria.destination =
    searchData.destination || ''

  searchCriteria.departureDate =
    searchData.departureDate || ''


  router.push({

    name: 'trips',

    query: {

      origin:
        searchCriteria.origin,

      destination:
        searchCriteria.destination,

      departureDate:
        searchCriteria.departureDate

    }

  })

}


// ==========================================
// LOAD TRIPS
// ==========================================

async function loadTrips() {

  try {

    isLoading.value = true

    errorMessage.value = ''


    const response =
      await api.get('/trips')


    if (Array.isArray(response.data)) {

      trips.value =
        response.data

    }

    else if (
      Array.isArray(response.data.trips)
    ) {

      trips.value =
        response.data.trips

    }

    else {

      trips.value = []

    }

  }

  catch (error) {

    console.error(
      'Unable to load trips:',
      error
    )

    errorMessage.value =
      error.response?.data?.message ||
      'Unable to load available trips.'

  }

  finally {

    isLoading.value = false

  }

}


// ==========================================
// DATE NORMALIZATION
// ==========================================

function normalizeDate(date) {

  if (!date) {
    return ''
  }


  const parsedDate =
    new Date(date)


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return String(date)

  }


  const year =
    parsedDate.getFullYear()


  const month =
    String(
      parsedDate.getMonth() + 1
    ).padStart(2, '0')


  const day =
    String(
      parsedDate.getDate()
    ).padStart(2, '0')


  return `${year}-${month}-${day}`

}


// ==========================================
// BASE SEARCH
// ==========================================

const searchedTrips = computed(() => {

  if (!hasSearchCriteria.value) {

    return []

  }


  const origin =
    searchCriteria.origin
      .trim()
      .toLowerCase()


  const destination =
    searchCriteria.destination
      .trim()
      .toLowerCase()


  const departureDate =
    searchCriteria.departureDate


  return trips.value.filter(
    (trip) => {

      if (!trip.isActive) {

        return false

      }


      if (
        Number(
          trip.availableSeats
        ) <= 0
      ) {

        return false

      }


      const tripOrigin =
        String(
          trip.origin || ''
        )
          .trim()
          .toLowerCase()


      const tripDestination =
        String(
          trip.destination || ''
        )
          .trim()
          .toLowerCase()


      const tripDate =
        normalizeDate(
          trip.departureDate
        )


      return (
        tripOrigin === origin &&
        tripDestination === destination &&
        tripDate === departureDate
      )

    }
  )

})


// ==========================================
// FILTER + SORT
// ==========================================

const displayedTrips = computed(() => {

  let result =
    [...searchedTrips.value]


  // DEPARTURE TIME
  if (
    selectedDepartureTime.value
  ) {

    result =
      result.filter(
        (trip) =>
          getDeparturePeriod(
            trip.departureTime
          ) ===
          selectedDepartureTime.value
      )

  }


  // MAX PRICE
if (selectedMaxPrice.value !== '') {
  const maxPrice = Number(selectedMaxPrice.value)

  console.log('MAX PRICE SELECTED:', selectedMaxPrice.value)
  console.log('MAX PRICE NUMBER:', maxPrice)

  result = result.filter((trip) => {
    const fare = Number(trip.fare)

    console.log(
      `${trip.departureTime} | ₱${fare} | ${fare <= maxPrice}`
    )

    return Number.isFinite(fare) && fare <= maxPrice
  })
}


  // BUS CLASS
  if (
    selectedBusClass.value
  ) {

    result =
      result.filter(
        (trip) =>
          trip.busClass ===
          selectedBusClass.value
      )

  }


  // SORT
  result.sort(
    (a, b) => {

      switch (
        sortOption.value
      ) {

        case 'earliest':

          return compareTime(
            a.departureTime,
            b.departureTime
          )


        case 'latest':

          return compareTime(
            b.departureTime,
            a.departureTime
          )


        case 'lowest-price':

          return (
            Number(a.fare || 0) -
            Number(b.fare || 0)
          )


        case 'highest-price':

          return (
            Number(b.fare || 0) -
            Number(a.fare || 0)
          )


        case 'fewest-seats':

          return (
            Number(a.availableSeats || 0) -
            Number(b.availableSeats || 0)
          )


        case 'most-seats':

          return (
            Number(b.availableSeats || 0) -
            Number(a.availableSeats || 0)
          )


        default:

          return 0

      }

    }
  )


  return result

})


// ==========================================
// DEPARTURE PERIOD
// ==========================================

function getDeparturePeriod(
  departureTime
) {

  if (!departureTime) {

    return ''

  }


  const time =
    String(
      departureTime
    )
      .trim()
      .toUpperCase()


  const match =
    time.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
    )


  if (!match) {

    return ''

  }


  let hour =
    Number(match[1])


  const period =
    match[3]


  if (period === 'AM') {

    if (hour === 12) {
      hour = 0
    }

  }

  else {

    if (hour !== 12) {
      hour += 12
    }

  }


  if (hour >= 5 && hour < 12) {

    return 'morning'

  }


  if (hour >= 12 && hour < 17) {

    return 'afternoon'

  }


  if (hour >= 17 && hour < 21) {

    return 'evening'

  }


  return 'night'

}


// ==========================================
// COMPARE TIME
// ==========================================

function compareTime(
  timeA,
  timeB
) {

  const convert =
    (time) => {

      if (!time) {
        return 0
      }


      const match =
        String(time)
          .trim()
          .toUpperCase()
          .match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
          )


      if (!match) {
        return 0
      }


      let hour =
        Number(match[1])


      const minute =
        Number(match[2])


      const period =
        match[3]


      if (
        period === 'AM' &&
        hour === 12
      ) {

        hour = 0

      }


      if (
        period === 'PM' &&
        hour !== 12
      ) {

        hour += 12

      }


      return (
        hour * 60 +
        minute
      )

    }


  return (
    convert(timeA) -
    convert(timeB)
  )

}


// ==========================================
// RESET FILTERS
// ==========================================

function resetFilters() {

  selectedDepartureTime.value = ''

  selectedMaxPrice.value = ''

  selectedBusClass.value = ''

  sortOption.value =
    'recommended'

}


// ==========================================
// CLEAR SEARCH
// ==========================================

function clearSearch() {

  searchCriteria.origin = ''

  searchCriteria.destination = ''

  searchCriteria.departureDate = ''


  resetFilters()


  router.push({
    name: 'trips'
  })

}


// ==========================================
// SELECT TRIP
// ==========================================

function handleTripSelect(trip) {

  router.push({

    name: 'trip-details',

    params: {
      tripId: trip._id
    }

  })

}


// ==========================================
// FORMAT DATE
// ==========================================

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


// ==========================================
// WATCH URL
// ==========================================

watch(

  () => route.query,

  () => {

    syncSearchFromRoute()

  },

  {
    deep: true
  }

)

</script>


<style scoped>

.seatex-trips-page {
  min-height: 100vh;
  background-color: #f8f9fb;
}


.seatex-trips-header {
  padding: 55px 0 30px;
}


.seatex-page-header {
  max-width: 750px;
}


.seatex-page-title {
  margin-top: 10px;
  margin-bottom: 10px;
  color: var(--seatex-navy);
  font-size: 36px;
  font-weight: 800;
}


.seatex-page-description {
  margin-bottom: 0;
  color: #6c757d;
}


.seatex-search-section {
  padding-bottom: 35px;
}


.seatex-results-section {
  padding-bottom: 70px;
}


.results-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}


.results-label {
  color: var(--seatex-primary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
}


.results-title {
  margin: 4px 0;
  color: var(--seatex-navy);
  font-size: 25px;
  font-weight: 800;
}


.results-description {
  color: #8a96a3;
  font-size: 13px;
}


.sort-wrapper {
  min-width: 220px;
}


.sort-label {
  display: block;
  margin-bottom: 5px;
  color: #8a96a3;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.7px;
}


.search-summary {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 18px;
  background-color: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 14px;
}


.search-summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}


.search-summary-item > i {
  color: var(--seatex-primary);
  font-size: 18px;
}


.search-summary-item > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}


.search-summary-item span {
  color: #8a96a3;
  font-size: 9px;
  font-weight: 800;
}


.search-summary-item strong {
  color: var(--seatex-navy);
  font-size: 13px;
}


.filter-card {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 16px;
}


.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}


.filter-header h3 {
  margin: 0;
  color: var(--seatex-navy);
  font-size: 17px;
  font-weight: 800;
}


.filter-group {
  margin-bottom: 18px;
}


.filter-group:last-child {
  margin-bottom: 0;
}


.filter-label {
  display: block;
  margin-bottom: 6px;
  color: #6c757d;
  font-size: 11px;
  font-weight: 700;
}


.seatex-trips-state {
  padding: 70px 20px;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 18px;
}


.seatex-empty-icon {
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  border-radius: 50%;
  background-color: var(--seatex-primary-soft);
  color: var(--seatex-primary);
  font-size: 27px;
}


.seatex-trips-state h3 {
  color: var(--seatex-navy);
  font-size: 20px;
  font-weight: 800;
}


.seatex-trips-state p {
  max-width: 500px;
  margin: 8px auto 20px;
  color: #8a96a3;
}


.trip-results {
  display: flex;
  flex-direction: column;
  gap: 18px;
}


@media (max-width: 991px) {

  .search-summary {
    flex-wrap: wrap;
  }

}


@media (max-width: 767px) {

  .seatex-page-title {
    font-size: 30px;
  }


  .results-header {
    align-items: flex-start;
    flex-direction: column;
  }


  .sort-wrapper {
    width: 100%;
  }


  .search-summary {
    align-items: flex-start;
    flex-direction: column;
  }


  .search-summary-item {
    width: 100%;
  }

}


@media (max-width: 576px) {

  .seatex-trips-header {
    padding-top: 35px;
  }


  .seatex-page-title {
    font-size: 27px;
  }

}

</style>