// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css'

// Import Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import Notyf CSS
import 'notyf/notyf.min.css'

// Import global SeatEx styles
import './assets/main.css'

// Import Vue
import { createApp } from 'vue'

// Import Pinia
import { createPinia } from 'pinia'

// Import App
import App from './App.vue'

// Import Router
import router from './router'

// Create Vue application
const app = createApp(App)

// Enable Pinia
app.use(createPinia())

// Enable Vue Router
app.use(router)

// Display application
app.mount('#app')