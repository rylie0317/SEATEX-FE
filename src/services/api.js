const API_BASE_URL = 'http://localhost:4000'

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Something went wrong with the request.'
    )
  }

  return data
}


export function getActiveTrips() {
  return request('/trips')
}


export function getTrip(tripId) {
  return request(`/trips/${tripId}`)
}


export function login(credentials) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}


export function createBooking(bookingData) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  })
}


export function getMyBookings() {
  return request('/bookings/my-bookings')
}


export default {
  getActiveTrips,
  getTrip,
  login,
  createBooking,
  getMyBookings
}