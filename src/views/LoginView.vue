<template>

  <div class="seatex-login-page">

    <div class="seatex-login-container">

      <!-- INTRO -->
      <div class="seatex-login-intro">

        <router-link
          to="/"
          class="seatex-login-logo"
        >
          SEATEX
        </router-link>


        <div class="seatex-login-intro-content">

          <p class="seatex-section-label">
            ONLINE BUS BOOKING SYSTEM
          </p>

          <h1>
            Welcome back.
          </h1>

          <p class="seatex-login-description">
            Log in to your SEATEX account to find bus trips,
            check seat availability, and manage your reservations.
          </p>


          <!-- BENEFITS -->
          <div class="seatex-login-benefits">

            <div
              v-for="benefit in loginBenefits"
              :key="benefit.text"
              class="seatex-login-benefit"
            >

              <div class="seatex-login-benefit-icon">

                <i :class="benefit.icon"></i>

              </div>

              <span>
                {{ benefit.text }}
              </span>

            </div>

          </div>

        </div>

      </div>


      <!-- LOGIN CARD -->
      <div class="seatex-login-card">

        <!-- HEADER -->
        <div class="seatex-login-header">

          <div class="seatex-login-icon">

            <i class="bi bi-person"></i>

          </div>


          <div>

            <p class="seatex-login-label">
              ACCOUNT LOGIN
            </p>

            <h2>
              Log in to SEATEX
            </h2>

            <p>
              Enter your account details to continue.
            </p>

          </div>

        </div>


        <!-- LOGIN FORM -->
        <form @submit.prevent="loginUser">

          <!-- EMAIL -->
          <div class="seatex-login-field">

            <label for="email">
              Email Address
            </label>

            <div class="seatex-input-wrapper">

              <i class="bi bi-envelope"></i>

              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                required
              />

            </div>

          </div>


          <!-- PASSWORD -->
          <div class="seatex-login-field">

            <label for="password">
              Password
            </label>

            <div class="seatex-input-wrapper">

              <i class="bi bi-lock"></i>

              <input
                id="password"
                v-model="password"
                :type="
                  showPassword
                    ? 'text'
                    : 'password'
                "
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />


              <!-- SHOW / HIDE PASSWORD -->
              <button
                type="button"
                class="seatex-password-toggle"
                :aria-label="
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                "
                @click="
                  showPassword = !showPassword
                "
              >

                <i
                  :class="
                    showPassword
                      ? 'bi bi-eye-slash'
                      : 'bi bi-eye'
                  "
                ></i>

              </button>

            </div>

          </div>


          <!-- LOGIN OPTIONS -->
          <div class="seatex-login-options">

            <label class="seatex-remember">

              <input
                v-model="rememberMe"
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>

          </div>


          <!-- LOGIN BUTTON -->
          <button
            type="submit"
            class="seatex-login-submit"
            :disabled="isLoading"
          >

            <span>
              {{ isLoading ? 'Logging in...' : 'Log In' }}
            </span>

            <i
              v-if="!isLoading"
              class="bi bi-arrow-right"
            ></i>

          </button>

        </form>


        <!-- SIGN UP DIVIDER -->
        <div class="seatex-login-divider">

          <span>
            or
          </span>

        </div>


        <!-- SIGN UP -->
        <p class="seatex-signup-text">

          Don't have an account?

          <router-link to="/register">
            Sign up
          </router-link>

        </p>


        <!-- BACK TO HOME -->
        <router-link
          to="/"
          class="seatex-back-home"
        >

          <i class="bi bi-arrow-left"></i>

          Back to SEATEX

        </router-link>

      </div>

    </div>

  </div>

</template>


<script setup>

import { ref } from 'vue'

import {
  useRoute,
  useRouter,
} from 'vue-router'

import {
  Notyf
} from 'notyf'

import api from '../api.js'

import {
  useGlobalStore
} from '../stores/global.js'

const route = useRoute()
const router = useRouter()

const store = useGlobalStore()

const notyf = new Notyf()


const email = ref('')
const password = ref('')

const showPassword = ref(false)

const rememberMe = ref(false)

const isLoading = ref(false)


const loginBenefits = [

  {
    icon: 'bi bi-search',
    text: 'Find available bus trips'
  },

  {
    icon: 'bi bi-grid-3x3-gap-fill',
    text: 'Check seat availability'
  },

  {
    icon: 'bi bi-calendar-check',
    text: 'Manage your reservations'
  }

]


async function loginUser() {

  try {

    isLoading.value = true


    /*
     * Send login request.
     */
    const response = await api.post(
      '/users/login',
      {
        email: email.value,
        password: password.value
      }
    )


    /*
     * Save login information.
     */
    store.setLogin(
      response.data.access,
      email.value
    )


    /*
     * Get the user's details.
     *
     * This determines whether the
     * account is an admin or customer.
     */
    await store.getUserDetails()


    /*
     * Show success notification.
     */
    notyf.success(
      response.data.message ||
      'Login successful.'
    )


    /*
     * Clear form fields.
     */
    email.value = ''
    password.value = ''


    /*
     * ADMIN
     *
     * Admin accounts go directly
     * to the admin dashboard.
     */
    if (store.user.isAdmin) {

      router.replace('/admin/dashboard')

      return

    }


    /*
     * NORMAL CUSTOMER LOGIN
     *
     * This is the regular login page.
     * It always goes to the homepage.
     *
     * Reservation login is handled separately
     * by ReserveLoginView.vue.
     */
    const redirect = route.query.redirect

    if (redirect) {
      router.replace(redirect)
    } else {
      router.replace('/')
    }

  } catch (error) {

    console.error(
      'Login error:',
      error
    )


    notyf.error(
      error.response?.data?.message ||
      'Login failed. Please check your email and password.'
    )

  } finally {

    isLoading.value = false

  }

}

</script>


<style scoped>

/* =========================================
   LOGIN PAGE
========================================= */

.seatex-login-page {

  min-height: calc(100vh - 62px);

  display: flex;

  align-items: center;

  padding: 55px 20px;

  background-color: #eef1f7;

}


.seatex-login-container {

  width: 100%;

  max-width: 1050px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    430px;

  align-items: center;

  gap: 70px;

}


/* =========================================
   INTRO
========================================= */

.seatex-login-intro {

  padding: 20px 0;

}


.seatex-login-logo {

  display: inline-block;

  margin-bottom: 60px;

  color: var(--seatex-navy);

  font-size: 20px;

  font-weight: 800;

  letter-spacing: 1px;

  text-decoration: none;

}


.seatex-login-logo:hover {

  color: var(--seatex-primary);

}


.seatex-login-intro-content {

  max-width: 520px;

}


.seatex-section-label {

  margin-bottom: 10px;

  color: var(--seatex-primary);

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1px;

}


.seatex-login-intro-content h1 {

  margin-bottom: 18px;

  color: var(--seatex-navy);

  font-size: clamp(38px, 5vw, 52px);

  font-weight: 800;

  line-height: 1.1;

  letter-spacing: -1.5px;

}


.seatex-login-description {

  max-width: 470px;

  margin-bottom: 32px;

  color: var(--seatex-muted);

  font-size: 15px;

  line-height: 1.8;

}


/* =========================================
   BENEFITS
========================================= */

.seatex-login-benefits {

  display: flex;

  flex-direction: column;

  gap: 14px;

}


.seatex-login-benefit {

  display: flex;

  align-items: center;

  gap: 12px;

  color: var(--seatex-text);

  font-size: 13px;

  font-weight: 600;

}


.seatex-login-benefit-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 36px;

  height: 36px;

  flex-shrink: 0;

  background-color: var(--seatex-primary-soft);

  border-radius: 9px;

  color: var(--seatex-primary);

  font-size: 15px;

}


/* =========================================
   LOGIN CARD
========================================= */

.seatex-login-card {

  padding: 32px;

  background-color: #ffffff;

  border: 1px solid var(--seatex-border);

  border-radius: 18px;

  box-shadow:
    0 15px 40px rgba(24, 59, 99, 0.08);

}


/* =========================================
   LOGIN HEADER
========================================= */

.seatex-login-header {

  display: flex;

  align-items: flex-start;

  gap: 14px;

  margin-bottom: 25px;

}


.seatex-login-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 42px;

  height: 42px;

  flex-shrink: 0;

  background-color: var(--seatex-primary-soft);

  border-radius: 11px;

  color: var(--seatex-primary);

  font-size: 19px;

}


.seatex-login-label {

  margin-bottom: 4px;

  color: var(--seatex-primary);

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1px;

}


.seatex-login-header h2 {

  margin-bottom: 4px;

  color: var(--seatex-navy);

  font-size: 22px;

  font-weight: 800;

}


.seatex-login-header > div:last-child > p:last-child {

  margin: 0;

  color: var(--seatex-muted);

  font-size: 12px;

}


/* =========================================
   FORM
========================================= */

.seatex-login-field {

  margin-bottom: 15px;

}


.seatex-login-field > label {

  display: block;

  margin-bottom: 7px;

  color: var(--seatex-text);

  font-size: 12px;

  font-weight: 700;

}


/* =========================================
   INPUT
========================================= */

.seatex-input-wrapper {

  position: relative;

  display: flex;

  align-items: center;

  height: 45px;

  padding: 0 13px;

  background-color: #ffffff;

  border: 1px solid var(--seatex-border);

  border-radius: 9px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

}


.seatex-input-wrapper:focus-within {

  border-color: var(--seatex-primary);

  box-shadow:
    0 0 0 3px var(--seatex-primary-soft);

}


.seatex-input-wrapper > i {

  flex-shrink: 0;

  margin-right: 9px;

  color: var(--seatex-subtle);

  font-size: 16px;

}


.seatex-input-wrapper input {

  width: 100%;

  height: 100%;

  min-width: 0;

  padding: 0;

  background: transparent;

  border: none;

  outline: none;

  color: var(--seatex-text);

  font-size: 13px;

}


.seatex-input-wrapper input::placeholder {

  color: #9aa7b5;

}


/* =========================================
   PASSWORD TOGGLE
========================================= */

.seatex-password-toggle {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 32px;

  height: 32px;

  flex-shrink: 0;

  padding: 0;

  background: transparent;

  border: none;

  color: var(--seatex-subtle);

  cursor: pointer;

}


.seatex-password-toggle:hover {

  color: var(--seatex-primary);

}


/* =========================================
   LOGIN OPTIONS
========================================= */

.seatex-login-options {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin: 3px 0 18px;

}


.seatex-remember {

  display: flex;

  align-items: center;

  gap: 7px;

  margin: 0;

  color: var(--seatex-muted);

  font-size: 11px;

  cursor: pointer;

}


.seatex-remember input {

  width: 14px;

  height: 14px;

  margin: 0;

  accent-color: var(--seatex-primary);

  cursor: pointer;

}


/* =========================================
   LOGIN BUTTON
========================================= */

/* =========================================
   LOGIN BUTTON
========================================= */

.seatex-login-submit {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 5px;

  background-color: var(--seatex-primary);
  border: none;
  border-radius: 9px;

  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.seatex-login-submit:hover:not(:disabled) {
  background-color: var(--seatex-primary);
  transform: translateY(-1px);
}

.seatex-login-submit:disabled {

  background-color: #cfd8e3;

  color: #7b8795;

  cursor: not-allowed;

}


/* =========================================
   DIVIDER
========================================= */

.seatex-login-divider {

  display: flex;

  align-items: center;

  gap: 12px;

  margin: 23px 0 17px;

  color: var(--seatex-subtle);

  font-size: 11px;

}


.seatex-login-divider::before,
.seatex-login-divider::after {

  content: '';

  flex: 1;

  height: 1px;

  background-color: var(--seatex-border);

}


/* =========================================
   SIGN UP
========================================= */

.seatex-signup-text {

  margin-bottom: 19px;

  color: var(--seatex-muted);

  font-size: 12px;

  text-align: center;

}


.seatex-signup-text a {

  color: var(--seatex-primary);

  font-weight: 700;

  text-decoration: none;

}


.seatex-signup-text a:hover {

  text-decoration: underline;

}


/* =========================================
   BACK HOME
========================================= */

.seatex-back-home {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  color: var(--seatex-muted);

  font-size: 11px;

  text-decoration: none;

}


.seatex-back-home:hover {

  color: var(--seatex-primary);

}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 900px) {

  .seatex-login-container {

    grid-template-columns: 1fr;

    max-width: 520px;

    gap: 35px;

  }


  .seatex-login-intro {

    padding: 0;

    text-align: center;

  }


  .seatex-login-logo {

    margin-bottom: 30px;

  }


  .seatex-login-intro-content {

    max-width: 520px;

    margin: 0 auto;

  }


  .seatex-login-description {

    margin-left: auto;

    margin-right: auto;

  }


  .seatex-login-benefits {

    align-items: center;

  }

}


@media (max-width: 576px) {

  .seatex-login-page {

    min-height: auto;

    padding: 40px 16px;

  }


  .seatex-login-container {

    gap: 30px;

  }


  .seatex-login-card {

    padding: 25px 21px;

    border-radius: 14px;

  }


  .seatex-login-intro-content h1 {

    font-size: 34px;

  }


  .seatex-login-description {

    font-size: 14px;

  }


  .seatex-login-header h2 {

    font-size: 20px;

  }

}

</style>