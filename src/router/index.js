import { createRouter, createWebHistory } from "vue-router";
import { useGlobalStore } from "../stores/global.js";

import HomeView from "../views/HomeView.vue";
import TripsView from "../views/TripsView.vue";
import LoginView from "../views/LoginView.vue";
import ReserveLoginView from '../views/ReserveLoginView.vue';
import RegisterView from "../views/RegisterView.vue";
import TripDetailsView from "../views/TripDetailsView.vue";
import BookingView from "../views/BookingView.vue";
import BookingSummaryView from "../views/BookingSummaryView.vue";
import PaymentView from "../views/PaymentView.vue";
import BookingConfirmationView from "../views/BookingConfirmationView.vue";
import MyReservationsView from "../views/MyReservationsView.vue";
import AdminLayout from '../components/admin/AdminLayout.vue';
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';
import AdminPaymentsView from '../views/admin/AdminPaymentsView.vue';
import AdminTripsView from '../views/admin/AdminTripsView.vue';
import AdminBookingsView from '../views/admin/AdminBookingsView.vue';

const router = createRouter({
  history: createWebHistory(),
    scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    return {
      top: 0
    }
  },
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/trips", name: "trips", component: TripsView },
    { path: "/trips/:tripId", name: "trip-details", component: TripDetailsView },
    { path: "/trips/:tripId/booking", name: "booking", component: BookingView },
    { path: "/trips/:tripId/booking/summary", name: "booking-summary", component: BookingSummaryView },
    { path: "/payment/:bookingId", name: "payment", component: PaymentView },
    { path: "/booking/:bookingId/confirmation", name: "booking-confirmation", component: BookingConfirmationView },
    { path: "/my-reservations", name: "my-reservations", component: MyReservationsView },

    {
      path: '/admin',
      component: AdminLayout,
      meta: { adminLayout: true, requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardView },
        { path: 'payments', name: 'admin-payments', component: AdminPaymentsView },
        { path: 'trips', name: 'admin-trips', component: AdminTripsView },
        { path: 'bookings', name: 'admin-bookings', component: AdminBookingsView }
      ]
    },

    { path: '/login', name: 'login', component: LoginView, meta: { hideFooter: true } },
    { path: '/reserve-login', name: 'reserve-login', component: ReserveLoginView, meta: { hideFooter: true } },
    { path: "/register", name: "register", component: RegisterView }
  ],
});

router.beforeEach(async (to) => {
  const store = useGlobalStore()
  await store.initializeAuth()

  if (to.meta.requiresAdmin) {
    if (!store.user.token) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }

    if (!store.user.isAdmin) {
      return { name: 'home' }
    }
  }

  return true
})

export default router;
