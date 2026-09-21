import { reactive } from 'vue'
import { defineStore } from 'pinia'
import api from '../api.js'

export const useGlobalStore = defineStore('global', () => {
  function getStoredValue(key) {
    return localStorage.getItem(key) || sessionStorage.getItem(key)
  }

  const user = reactive({
    token: getStoredValue('token'),
    email: getStoredValue('email'),
    isAdmin: null
  })

  let authInitialized = false

  function setLogin(token, email, rememberMe = true) {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('email')

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('token', token)
    storage.setItem('email', email)

    user.token = token
    user.email = email
    user.isAdmin = null
    authInitialized = false
  }

  async function getUserDetails() {
    if (!user.token) {
      user.isAdmin = null
      return null
    }

    try {
      const response = await api.get('/users/details', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      user.isAdmin = response.data.isAdmin === true
      return response.data
    } catch (error) {
      console.error('Unable to get user details:', error)
      return null
    }
  }

  async function initializeAuth() {
    if (authInitialized && user.isAdmin !== null) {
      return
    }

    authInitialized = true

    if (!user.token) {
      user.isAdmin = null
      return
    }

    const details = await getUserDetails()

    if (!details) {
      logout()
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('email')

    user.token = null
    user.email = null
    user.isAdmin = null
    authInitialized = true
  }

  return {
    user,
    setLogin,
    getUserDetails,
    initializeAuth,
    logout
  }
})
