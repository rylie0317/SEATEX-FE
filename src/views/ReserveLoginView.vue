<template>
  <div class="seatex-reserve-login-page">

    <div class="container">

      <div class="row justify-content-center">

        <div class="col-12 col-md-6 col-lg-5">

          <div class="seatex-reserve-login-card">

            <!-- HEADER -->
            <div class="text-center mb-4">

              <span class="seatex-badge-label">
                RESERVATION
              </span>

              <h1 class="fw-bold mt-2">
                Continue Your Reservation
              </h1>

              <p class="text-muted mb-0">
                Please log in or create an account to continue
                with your selected trip.
              </p>

            </div>


            <!-- LOGIN FORM -->
            <form @submit.prevent="loginUser">

              <!-- EMAIL -->
              <div class="mb-3">

                <label
                  for="reserve-email"
                  class="form-label"
                >
                  Email Address
                </label>

                <input
                  id="reserve-email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="Enter your email"
                  autocomplete="email"
                  required
                />

              </div>


              <!-- PASSWORD -->
              <div class="mb-3">

                <label
                  for="reserve-password"
                  class="form-label"
                >
                  Password
                </label>

                <input
                  id="reserve-password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                />

              </div>


              <!-- LOGIN -->
              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="isLoading"
              >

                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>

                {{ isLoading ? 'Logging in...' : 'Continue to Reservation' }}

              </button>

            </form>


            <!-- REGISTER -->
            <div class="text-center mt-4">

              <p class="text-muted mb-0">
                Don't have an account?
              </p>

              <router-link
                :to="registerLink"
                class="fw-semibold text-decoration-none"
              >
                Create an Account
              </router-link>

            </div>


            <!-- BACK -->
            <div class="text-center mt-3">

              <button
                type="button"
                class="btn btn-link text-muted text-decoration-none"
                @click="goBack"
              >
                <i class="bi bi-arrow-left me-1"></i>
                Back to Trips
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup>

import {
  computed,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  Notyf
} from 'notyf'

import api from '../api.js'

import {
  useGlobalStore
} from '../stores/global.js'


const router = useRouter()
const route = useRoute()

const store = useGlobalStore()

const notyf = new Notyf()


const email = ref('')
const password = ref('')

const isLoading = ref(false)


/*
 * Preserve the selected trip when
 * going from Reservation Login → Register.
 */
const registerLink = computed(() => {

  return {
    name: 'register',
    query: {
      redirect: route.query.redirect
    }
  }

})


async function loginUser() {

  try {

    isLoading.value = true


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
     * Get the user's complete details.
     */
    await store.getUserDetails()


    notyf.success(
      response.data.message ||
      'Login successful.'
    )


    email.value = ''
    password.value = ''


    /*
     * Admin accounts should still go
     * to the admin dashboard.
     */
    if (store.user.isAdmin) {

      router.replace('/admin/dashboard')

      return

    }


    /*
     * Customer came from Reserve Seat.
     *
     * Example:
     *
     * /reserve-login?redirect=/trips/12345
     *
     * Send the customer back to:
     *
     * /trips/12345
     */
    if (route.query.redirect) {

      router.replace(
        String(route.query.redirect)
      )

      return

    }


    /*
     * Safety fallback.
     */
    router.replace('/')

  } catch (error) {

    console.error(
      'Reservation login error:',
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


function goBack() {

  router.push({
    name: 'trips'
  })

}

</script>
<style scoped>

/* =========================================================
   RESERVATION LOGIN PAGE
========================================================= */

.seatex-reserve-login-page {
  min-height: calc(100vh - 73px);

  display: flex;

  align-items: center;

  padding: 65px 0;

  background:
    linear-gradient(
      135deg,
      #edf5ff 0%,
      #f7faff 50%,
      #ffffff 100%
    );
}


/* =========================================================
   LOGIN CARD
========================================================= */

.seatex-reserve-login-card {
  padding: 38px 38px 30px;

  background-color: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 20px;

  box-shadow:
    0 18px 45px rgba(24, 59, 99, 0.10);
}


/* =========================================================
   HEADER
========================================================= */

.seatex-reserve-login-header {
  margin-bottom: 32px;
}

.seatex-reserve-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 58px;
  height: 58px;

  margin: 0 auto 18px;

  color: var(--seatex-primary);

  background-color: var(--seatex-primary-soft);

  border: 1px solid #d6e5fb;

  border-radius: 16px;

  font-size: 1.45rem;
}

.seatex-badge-label {
  display: inline-block;

  color: var(--seatex-primary);

  font-size: 0.72rem;

  font-weight: 750;

  letter-spacing: 0.12em;
}

.seatex-reserve-login-header h1 {
  margin: 9px 0 10px;

  color: var(--seatex-navy);

  font-size: 1.85rem;

  font-weight: 750;

  line-height: 1.2;
}

.seatex-reserve-login-header p {
  max-width: 360px;

  margin: 0 auto;

  color: var(--seatex-muted);

  font-size: 0.92rem;

  line-height: 1.6;
}


/* =========================================================
   FORM
========================================================= */

.seatex-form-group {
  margin-bottom: 19px;
}

.seatex-form-label {
  display: block;

  margin-bottom: 7px;

  color: var(--seatex-navy);

  font-size: 0.84rem;

  font-weight: 650;
}

.seatex-input-wrapper {
  position: relative;
}

.seatex-input-wrapper > i {
  position: absolute;

  top: 50%;
  left: 14px;

  z-index: 2;

  color: var(--seatex-muted);

  font-size: 0.95rem;

  transform: translateY(-50%);
}

.seatex-input-wrapper .form-control {
  height: 48px;

  padding-left: 42px;
  padding-right: 14px;

  color: var(--seatex-text);

  background-color: #f9fbfe;

  border: 1px solid #dce4ee;

  border-radius: 10px;

  font-size: 0.9rem;
}

.seatex-input-wrapper .form-control::placeholder {
  color: #9aa5b4;

  font-weight: 400;
}

.seatex-input-wrapper .form-control:focus {
  color: var(--seatex-text);

  background-color: #ffffff;

  border-color: var(--seatex-primary);

  box-shadow:
    0 0 0 3px rgba(13, 110, 253, 0.10);
}

.seatex-input-wrapper:focus-within > i {
  color: var(--seatex-primary);
}


/* =========================================================
   LOGIN BUTTON
========================================================= */

.seatex-reserve-login-button {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  min-height: 48px;

  gap: 9px;

  margin-top: 25px;

  padding: 0 20px;

  color: #ffffff;

  background-color: var(--seatex-primary);

  border: 1px solid var(--seatex-primary);

  border-radius: 10px;

  font-size: 0.9rem;

  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.seatex-reserve-login-button:hover:not(:disabled) {
  color: #ffffff;

  background-color: var(--seatex-primary);

  border-color: var(--seatex-primary);

  transform: translateY(-1px);

  box-shadow:
    0 7px 18px rgba(13, 110, 253, 0.18);
}

.seatex-reserve-login-button:active:not(:disabled) {
  transform: translateY(0);

  box-shadow: none;
}

.seatex-reserve-login-button:disabled {
  opacity: 0.7;

  cursor: not-allowed;
}


/* =========================================================
   REGISTER
========================================================= */

.seatex-register-section {
  margin-top: 27px;

  padding-top: 23px;

  text-align: center;

  border-top: 1px solid #edf0f4;
}

.seatex-register-section p {
  margin: 0 0 7px;

  color: var(--seatex-muted);

  font-size: 0.84rem;
}

.seatex-register-link {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  color: var(--seatex-primary);

  font-size: 0.88rem;

  font-weight: 700;

  text-decoration: none;

  transition: color 0.2s ease;
}

.seatex-register-link:hover {
  color: var(--seatex-primary);

  text-decoration: underline;
}


/* =========================================================
   BACK BUTTON
========================================================= */

.seatex-back-section {
  margin-top: 18px;

  text-align: center;
}

.seatex-back-button {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 6px 10px;

  color: var(--seatex-muted);

  background: transparent;

  border: none;

  font-size: 0.84rem;

  font-weight: 600;

  cursor: pointer;

  transition:
    color 0.2s ease;
}

.seatex-back-button:hover {
  color: var(--seatex-primary);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 767.98px) {

  .seatex-reserve-login-page {
    min-height: calc(100vh - 65px);

    padding: 45px 0;
  }

  .seatex-reserve-login-card {
    padding: 32px 25px 25px;

    border-radius: 17px;
  }

  .seatex-reserve-login-header h1 {
    font-size: 1.65rem;
  }

}


@media (max-width: 575.98px) {

  .seatex-reserve-login-page {
    padding: 30px 0;
  }

  .seatex-reserve-login-card {
    padding: 28px 20px 22px;

    border-radius: 15px;
  }

  .seatex-reserve-icon {
    width: 52px;
    height: 52px;

    margin-bottom: 15px;
  }

  .seatex-reserve-login-header {
    margin-bottom: 27px;
  }

  .seatex-reserve-login-header h1 {
    font-size: 1.5rem;
  }

}

</style>