
<template>
  

  <div class="seatex-register-page">

    <div class="seatex-register-container">

      <!-- INTRO -->
      <div class="seatex-register-intro">

        <router-link
          to="/"
          class="seatex-register-logo"
        >
          SEATEX
        </router-link>


        <div class="seatex-register-intro-content">

          <p class="seatex-badge-label">
            ONLINE BUS BOOKING SYSTEM
          </p>

          <h1>
            Start your journey.
          </h1>

          <p class="seatex-register-description">
            Create your SEATEX account to find bus trips,
            check seat availability, and manage your reservations.
          </p>


          <div class="seatex-register-benefits">

            <div
              v-for="benefit in registerBenefits"
              :key="benefit.text"
              class="seatex-register-benefit"
            >

              <div class="seatex-register-benefit-icon">
                <i :class="benefit.icon"></i>
              </div>

              <span>
                {{ benefit.text }}
              </span>

            </div>

          </div>

        </div>

      </div>


      <!-- REGISTER CARD -->
      <div class="seatex-register-card">

        <!-- HEADER -->
        <div class="seatex-register-header">

          <div class="seatex-register-icon">
            <i class="bi bi-person-plus"></i>
          </div>

          <div>

            <p class="seatex-register-label">
              CREATE ACCOUNT
            </p>

            <h2>
              Sign up for SEATEX
            </h2>

            <p>
              Enter your details to create your account.
            </p>

          </div>

        </div>




        <!-- FORM -->
        <form @submit.prevent="handleRegister">

          <!-- FIRST NAME + LAST NAME -->
          <div class="row g-3">

            <div class="col-12 col-sm-6">

              <div class="seatex-register-field">

                <label for="firstName">
                  First Name
                </label>

                <div class="seatex-input-wrapper">

                  <i class="bi bi-person"></i>

                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    placeholder="First name"
                    autocomplete="given-name"
                    required
                  />

                </div>

              </div>

            </div>


            <div class="col-12 col-sm-6">

              <div class="seatex-register-field">

                <label for="lastName">
                  Last Name
                </label>

                <div class="seatex-input-wrapper">

                  <i class="bi bi-person"></i>

                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    placeholder="Last name"
                    autocomplete="family-name"
                    required
                  />

                </div>

              </div>

            </div>

          </div>


          <!-- EMAIL -->
          <div class="seatex-register-field">

            <label for="email">
              Email Address
            </label>

            <div class="seatex-input-wrapper">

              <i class="bi bi-envelope"></i>

              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                required
              />

            </div>

          </div>


          <!-- MOBILE NUMBER -->
          <div class="seatex-register-field">

            <label for="mobileNo">
              Mobile Number
            </label>

            <div class="seatex-input-wrapper">

              <i class="bi bi-phone"></i>

              <input
                id="mobileNo"
                v-model="form.mobileNo"
                type="tel"
                placeholder="Enter your mobile number"
                autocomplete="tel"
                required
              />

            </div>

          </div>


          <!-- PASSWORD -->
          <div class="seatex-register-field">

            <label for="password">
              Password
            </label>

            <div class="seatex-input-wrapper">

              <i class="bi bi-lock"></i>

              <input
                id="password"
                v-model="form.password"
                :type="
                  showPassword
                    ? 'text'
                    : 'password'
                "
                placeholder="Create a password"
                autocomplete="new-password"
                required
              />

              <button
                type="button"
                class="seatex-password-toggle"
                :aria-label="
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                "
                @click="showPassword = !showPassword"
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


          <!-- CONFIRM PASSWORD -->
          <div class="seatex-register-field">

            <label for="confirmPassword">
              Confirm Password
            </label>

            <div class="seatex-input-wrapper">

              <i class="bi bi-lock-fill"></i>

              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                "
                placeholder="Confirm your password"
                autocomplete="new-password"
                required
              />

              <button
                type="button"
                class="seatex-password-toggle"
                :aria-label="
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                "
                @click="
                  showConfirmPassword = !showConfirmPassword
                "
              >

                <i
                  :class="
                    showConfirmPassword
                      ? 'bi bi-eye-slash'
                      : 'bi bi-eye'
                  "
                ></i>

              </button>

            </div>

          </div>


          <!-- PASSWORD ERROR -->
          <p
            v-if="
              form.confirmPassword &&
              form.password !== form.confirmPassword
            "
            class="seatex-password-error"
          >
            Passwords do not match.
          </p>


          <!-- REGISTER BUTTON -->
          <button
            type="submit"
            class="seatex-register-submit"
            :disabled="
              isLoading ||
              form.password !== form.confirmPassword
            "
          >

            <span>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </span>

            <i
              v-if="!isLoading"
              class="bi bi-arrow-right"
            ></i>

          </button>

        </form>


        <!-- LOGIN -->
        <div class="seatex-register-divider">
          <span>or</span>
        </div>

        <p class="seatex-login-text">

                Already have an account?

                <router-link
        :to="{
          name: 'reserve-login',
          query: {
            redirect: route.query.redirect
          }
        }"
      >
        Log in
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

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  reactive,
  ref
} from 'vue'

import {
  Notyf
} from 'notyf'

import api from '../api.js'


const router = useRouter()
const route = useRoute()

const notyf = new Notyf()


const registerBenefits = [
  {
    icon: 'bi bi-search',
    text: 'Find available bus trips'
  },
  {
    icon: 'bi-grid-3x3-gap-fill',
    text: 'Check seat availability'
  },
  {
    icon: 'bi bi-calendar-check',
    text: 'Manage your reservations'
  }
]


const form = reactive({

  firstName: '',
  lastName: '',
  email: '',
  mobileNo: '',
  password: '',
  confirmPassword: ''

})


const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isLoading = ref(false)


async function handleRegister() {

  /*
   * Validate required fields.
   */
  if (
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.mobileNo ||
    !form.password ||
    !form.confirmPassword
  ) {

    notyf.error(
      'Please complete all required fields.'
    )

    return

  }


  /*
   * Validate passwords.
   */
  if (
    form.password !==
    form.confirmPassword
  ) {

    notyf.error(
      'Passwords do not match.'
    )

    return

  }


  isLoading.value = true


  try {

    /*
     * Create the account.
     */
    const response = await api.post(
      '/users/register',
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobileNo: form.mobileNo,
        password: form.password
      }
    )


    if (response.status === 201) {

      notyf.success(
        response.data.message ||
        'Registration successful.'
      )


      /*
       * Clear the form.
       */
      form.firstName = ''
      form.lastName = ''
      form.email = ''
      form.mobileNo = ''
      form.password = ''
      form.confirmPassword = ''


      /*
       * Give the success notification time
       * to appear before redirecting.
       */
      setTimeout(() => {

        /*
         * If registration started from
         * Reserve Seat, preserve the
         * selected trip.
         *
         * Example:
         *
         * /register?redirect=/trips/12345
         *
         * After registration:
         *
         * /reserve-login?redirect=/trips/12345
         */
        if (route.query.redirect) {

          router.push({
            name: 'reserve-login',
            query: {
              redirect: String(
                route.query.redirect
              )
            }
          })

        } else {

          /*
           * Normal registration.
           */
          router.push('/login')

        }

      }, 1200)

    }

  } catch (error) {

    console.error(
      'Registration error:',
      error
    )


    if (error.response) {

      notyf.error(
        error.response.data?.message ||
        'Registration failed.'
      )

    } else {

      notyf.error(
        'Unable to connect to the SEATEX server. Please make sure the backend is running.'
      )

    }

  } finally {

    isLoading.value = false

  }

}

</script>


<style scoped>

.seatex-register-page {
  min-height: calc(100vh - 62px);

  display: flex;
  align-items: center;

  padding: 60px 20px;

  background:
    linear-gradient(
      135deg,
      #f8faff 0%,
      #eef4fc 100%
    );
}


.seatex-register-container {
  width: 100%;
  max-width: 1050px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(380px, 460px);

  align-items: center;

  gap: 75px;
}


/* =========================
   INTRO
========================= */

.seatex-register-intro {
  padding: 20px 0;
}


.seatex-register-logo {
  display: inline-block;

  margin-bottom: 60px;

  color: var(--seatex-navy);

  font-size: 20px;
  font-weight: 800;

  letter-spacing: 1px;
}


.seatex-register-intro-content {
  max-width: 520px;
}


.seatex-register-intro-content h1 {
  margin-bottom: 18px;

  color: var(--seatex-navy);

  font-size: clamp(38px, 5vw, 52px);

  font-weight: 800;

  line-height: 1.1;

  letter-spacing: -1.5px;
}


.seatex-register-description {
  max-width: 470px;

  margin-bottom: 32px;

  color: var(--seatex-muted);

  font-size: 15px;

  line-height: 1.8;
}


/* =========================
   BENEFITS
========================= */

.seatex-register-benefits {
  display: flex;
  flex-direction: column;

  gap: 14px;
}


.seatex-register-benefit {
  display: flex;
  align-items: center;

  gap: 12px;

  color: var(--seatex-text);

  font-size: 13px;
  font-weight: 600;
}


.seatex-register-benefit-icon {
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


/* =========================
   REGISTER CARD
========================= */

.seatex-register-card {
  padding: 32px;

  background-color: #ffffff;

  border: 1px solid var(--seatex-border);

  border-radius: 18px;

  box-shadow:
    0 15px 40px rgba(24, 59, 99, 0.08);
}


/* =========================
   HEADER
========================= */

.seatex-register-header {
  display: flex;
  align-items: flex-start;

  gap: 14px;

  margin-bottom: 25px;
}


.seatex-register-icon {
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


.seatex-register-label {
  margin-bottom: 4px;

  color: var(--seatex-primary);

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1px;
}


.seatex-register-header h2 {
  margin-bottom: 4px;

  color: var(--seatex-navy);

  font-size: 22px;

  font-weight: 800;
}


.seatex-register-header > div:last-child > p:last-child {
  margin: 0;

  color: var(--seatex-muted);

  font-size: 12px;
}


/* =========================
   FORM
========================= */

.seatex-register-field {
  margin-bottom: 15px;
}


.seatex-register-field > label {
  display: block;

  margin-bottom: 7px;

  color: var(--seatex-text);

  font-size: 12px;

  font-weight: 700;
}


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


/* =========================
   PASSWORD TOGGLE
========================= */

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


/* =========================
   MESSAGES
========================= */

.seatex-register-message {
  display: flex;
  align-items: flex-start;

  gap: 9px;

  margin-bottom: 18px;

  padding: 11px 13px;

  border-radius: 8px;

  font-size: 11px;
  line-height: 1.5;
}


.seatex-register-error {
  background-color: #fff1f1;

  border: 1px solid #f3d0d0;

  color: #b42318;
}


.seatex-register-success {
  background-color: #edf9f1;

  border: 1px solid #ccebd5;

  color: #16834b;
}


.seatex-register-message i {
  margin-top: 1px;
}


/* =========================
   PASSWORD ERROR
========================= */

.seatex-password-error {
  margin-top: -5px;
  margin-bottom: 13px;

  color: #c0392b;

  font-size: 11px;
}


/* =========================
   REGISTER BUTTON
========================= */

.seatex-register-submit {
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


.seatex-register-submit:hover:not(:disabled) {


  transform: translateY(-1px);
}


.seatex-register-submit:disabled {
  background-color: #cfd8e3;

  color: #7b8795;

  cursor: not-allowed;
}


/* =========================
   LOGIN LINK
========================= */

.seatex-register-divider {
  display: flex;
  align-items: center;

  gap: 12px;

  margin: 23px 0 17px;

  color: var(--seatex-subtle);

  font-size: 11px;
}


.seatex-register-divider::before,
.seatex-register-divider::after {
  content: '';

  flex: 1;

  height: 1px;

  background-color: var(--seatex-border);
}


.seatex-login-text {
  margin-bottom: 19px;

  color: var(--seatex-muted);

  font-size: 12px;

  text-align: center;
}


.seatex-login-text a {
  color: var(--seatex-primary);

  font-weight: 700;
}


.seatex-login-text a:hover {
  text-decoration: underline;
}


/* =========================
   BACK HOME
========================= */

.seatex-back-home {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  color: var(--seatex-muted);

  font-size: 11px;
}


.seatex-back-home:hover {
  color: var(--seatex-primary);
}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 900px) {

  .seatex-register-container {
    grid-template-columns: 1fr;

    max-width: 520px;

    gap: 35px;
  }


  .seatex-register-intro {
    padding: 0;

    text-align: center;
  }


  .seatex-register-logo {
    margin-bottom: 30px;
  }


  .seatex-register-intro-content {
    max-width: 520px;

    margin: 0 auto;
  }


  .seatex-register-description {
    margin-left: auto;
    margin-right: auto;
  }


  .seatex-register-benefits {
    align-items: center;
  }

}


@media (max-width: 576px) {

  .seatex-register-page {
    min-height: auto;

    padding: 40px 16px;
  }


  .seatex-register-container {
    gap: 30px;
  }


  .seatex-register-card {
    padding: 25px 21px;

    border-radius: 14px;
  }


  .seatex-register-intro-content h1 {
    font-size: 34px;
  }


  .seatex-register-description {
    font-size: 14px;
  }


  .seatex-register-header h2 {
    font-size: 20px;
  }

}

</style>