<template>
  <div class="seatex-home">

    <!-- HERO -->
    <section class="seatex-hero">
      <div class="container">

        <div class="seatex-hero-content">

          <p class="seatex-badge-label">
            ONLINE BUS BOOKING SYSTEM
          </p>

          <h1 class="seatex-hero-title">
            Travel Made Easier with
            <span>SEATEX</span>
          </h1>

          <p class="seatex-hero-description">
            Search for available bus trips, check remaining seats,
            and reserve your trip online.
          </p>

        </div>

        <!-- TRIP SEARCH -->
        <div class="seatex-search-wrapper">

          <div class="seatex-search-heading">
            <div>
              <span class="seatex-search-label">
                FIND YOUR TRIP
              </span>

              <h2>
                Search Bus Trips
              </h2>
            </div>

            <i class="bi bi-bus-front-fill"></i>
          </div>

          <TripSearch @search="handleSearch" />

        </div>

      </div>
    </section>

    <!-- BUS CLASSES -->
    <section class="seatex-bus-classes">
      <div class="container">

        <div class="seatex-section-header">
          <p class="seatex-badge-label">
            BUS CLASSES
          </p>

          <h2 class="seatex-section-heading">
            Choose Your Preferred Bus Class
          </h2>

          <p class="seatex-section-desc">
            Choose from the available bus classes offered for your trip.
          </p>
        </div>

        <div class="row g-4">

          <div
            v-for="busClass in busClasses"
            :key="busClass.name"
            class="col-12 col-sm-6 col-lg-3"
          >
            <div class="seatex-bus-class-card">

              <div class="seatex-bus-class-icon">
                <i :class="busClass.icon"></i>
              </div>

              <h3>
                {{ busClass.name }}
              </h3>

              <p>
                {{ busClass.description }}
              </p>



            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- QUICK INFORMATION -->
    <section class="seatex-quick-info">
      <div class="container">

        <div class="seatex-hero-info">

          <span
            v-for="item in heroInfo"
            :key="item.text"
          >
            <i :class="item.icon"></i>
            {{ item.text }}
          </span>

        </div>

      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="seatex-section seatex-section-white">
      <div class="container">

        <div class="seatex-section-header">

          <p class="seatex-badge-label">
            HOW IT WORKS
          </p>

          <h2 class="seatex-section-heading">
            Book Your Bus Trip in Three Steps
          </h2>

          <p class="seatex-section-desc">
            SEATEX makes it easier to find and reserve your preferred
            bus trip online.
          </p>

        </div>

        <div class="row g-4">

          <div
            v-for="step in bookingSteps"
            :key="step.number"
            class="col-12 col-md-4"
          >
            <div class="seatex-step-card">


              <div class="seatex-step-icon">
                <i :class="step.icon"></i>
              </div>

              <h3>
                {{ step.title }}
              </h3>

              <p>
                {{ step.description }}
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- FEATURES -->
    <section class="seatex-section">
      <div class="container">

        <div class="seatex-section-header">

          <p class="seatex-badge-label">
            FEATURES
          </p>

          <h2 class="seatex-section-heading">
            Everything You Need for Your Trip
          </h2>

          <p class="seatex-section-desc">
            SEATEX provides the essential features you need to
            search, reserve, and manage your bus trip.
          </p>

        </div>

        <div class="row g-4">

          <div
            v-for="feature in features"
            :key="feature.title"
            class="col-12 col-sm-6 col-lg-3"
          >
            <div class="seatex-feature-card">

              <div class="seatex-feature-icon">
                <i :class="feature.icon"></i>
              </div>

              <h3>
                {{ feature.title }}
              </h3>

              <p>
                {{ feature.description }}
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ABOUT -->
    <section id="about" class="seatex-about">
      <div class="container">

        <div class="row align-items-center g-5">

          <div class="col-12 col-lg-6">

            <p class="seatex-badge-label">
              ABOUT SEATEX
            </p>

            <h2 class="seatex-section-heading">
              A Simpler Way to Reserve Your Bus Trip
            </h2>

            <p class="seatex-about-description">
              SEATEX is an online bus booking system designed to help
              passengers search for available trips, check seat
              availability, and reserve their preferred bus trip online.
            </p>

            <p class="seatex-about-description">
              Instead of visiting a terminal to check available trips,
              passengers can use SEATEX to view trip information and
              complete their reservation online.
            </p>

          </div>

          <div class="col-12 col-lg-6">

            <div class="seatex-about-card">

              <div
                v-for="item in aboutItems"
                :key="item.title"
                class="seatex-about-item"
              >

                <div class="seatex-about-icon">
                  <i :class="item.icon"></i>
                </div>

                <div>
                  <h3>
                    {{ item.title }}
                  </h3>

                  <p>
                    {{ item.description }}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- CONTACT -->
<section id="contact" class="seatex-contact">

  <div class="seatex-contact-decoration seatex-contact-decoration-one"></div>
  <div class="seatex-contact-decoration seatex-contact-decoration-two"></div>

  <div class="container">

    <div class="seatex-contact-card">

      <!-- LEFT -->
      <div class="seatex-contact-content">

        <span class="seatex-contact-eyebrow">
          <i class="bi bi-headset"></i>
          SEATEX SUPPORT
        </span>

        <h2 class="seatex-contact-title">
          Need Help With
          <span>Your Trip?</span>
        </h2>

        <p class="seatex-contact-description">
          Have questions about your trip or reservation?
          Our support team is here to help you have a
          smoother booking experience with SEATEX.
        </p>


<div class="seatex-contact-info">

  <!-- EMAIL -->
  <div class="seatex-contact-item">

    <div class="seatex-contact-item-icon">
      <i class="bi bi-envelope-fill"></i>
    </div>

    <div class="seatex-contact-item-content">
      <span>EMAIL US</span>
      <strong>support@seatex.com</strong>
    </div>

  </div>


  <!-- PHONE -->
  <div class="seatex-contact-item">

    <div class="seatex-contact-item-icon">
      <i class="bi bi-telephone-fill"></i>
    </div>

    <div class="seatex-contact-item-content">
      <span>CALL US</span>
      <strong>+63 900 000 0000</strong>
    </div>

  </div>

</div>

      </div>


      <!-- RIGHT VISUAL -->
      <div class="seatex-contact-visual">

        <div class="seatex-contact-circle">

          <div class="seatex-contact-bus-icon">
            <i class="bi bi-bus-front-fill"></i>
          </div>

        </div>


        <div class="seatex-contact-route route-one">
          <span></span>
        </div>

        <div class="seatex-contact-route route-two">
          <span></span>
        </div>


        <div class="seatex-contact-floating-card">

          <i class="bi bi-check-circle-fill"></i>

          <div>

            <strong>
              We're Here to Help
            </strong>

            <span>
              Travel with confidence
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import TripSearch from '../components/trips/TripSearch.vue'

const router = useRouter()

function handleSearch(searchData) {
  router.push({
    name: 'trips',
    query: {
      origin: searchData.origin,
      destination: searchData.destination,
      departureDate: searchData.departureDate
    }
  })
}

const heroInfo = [
  {
    icon: 'bi bi-check-circle-fill',
    text: 'Check available trips'
  },
  {
    icon: 'bi bi-grid-3x3-gap-fill',
    text: 'View remaining seats'
  },
  {
    icon: 'bi bi-calendar-check-fill',
    text: 'Reserve online'
  }
]

const busClasses = [
  {
    icon: 'bi bi-bus-front',
    name: 'Regular Aircon',
    description:
      'A practical and affordable option with standard air-conditioned seating for everyday bus travel.'
  },
  {
    icon: 'bi bi-bus-front-fill',
    name: 'Deluxe',
    description:
      'Enjoy a more spacious seating arrangement and added comfort for a more relaxed journey.'
  },
  {
    icon: 'bi bi-star-fill',
    name: 'First Class',
    description:
      'A premium bus experience with upgraded seating, greater personal space, and enhanced comfort.'
  },
  {
    icon: 'bi bi-moon-stars-fill',
    name: 'Sleeper',
    description:
      'Designed for long-distance travel with sleeper-style seating that lets passengers rest during the journey.'
  }
]

const bookingSteps = [
  {
    number: '01',
    icon: 'bi bi-search',
    title: 'Search for a Trip',
    description:
      'Enter your origin, destination, and preferred departure date to find available bus trips.'
  },
  {
    number: '02',
    icon: 'bi bi-bus-front',
    title: 'Choose Your Trip',
    description:
      'View available trips and check the remaining number of seats before making a reservation.'
  },
  {
    number: '03',
    icon: 'bi bi-check-circle',
    title: 'Secure Your Reservation',
    description:
      'Reserve your selected trip and complete the required 30% downpayment with your payment reference.'
  }
]

const features = [
  {
    icon: 'bi bi-bus-front-fill',
    title: 'View Available Trips',
    description:
      'Find available bus trips based on your selected route and departure date.'
  },
  {
    icon: 'bi bi-grid-3x3-gap-fill',
    title: 'Check Seat Availability',
    description:
      'Check the remaining available seats before choosing a trip.'
  },
  {
    icon: 'bi bi-percent',
    title: '30% Downpayment',
    description:
      'Secure your reservation by completing the required 30% downpayment.'
  },
  {
    icon: 'bi bi-check-circle-fill',
    title: 'Booking Confirmation',
    description:
      'Check your reservation status after your payment has been verified.'
  }
]

const aboutItems = [
  {
    icon: 'bi bi-search',
    title: 'Easy Search',
    description: 'Find available bus trips'
  },
  {
    icon: 'bi bi-grid-3x3-gap-fill',
    title: 'Seat Availability',
    description: 'Check remaining seats'
  },
  {
    icon: 'bi bi-calendar-check',
    title: 'Online Reservation',
    description: 'Reserve your selected trip'
  }
]
</script>