import { apiClient } from './client'

export const bookingsAPI = {
  // Player APIs
  createBooking: async (bookingData: {
    propertyId: string
    date: string
    timeSlot: string
    duration: number
  }) => {
    const response = await apiClient.post('/bookings', bookingData)
    return response.data
  },

  getMyBookings: async () => {
    const response = await apiClient.get('/bookings/my-bookings')
    return response.data
  },

  // Owner APIs
  getPropertyBookings: async (propertyId: string) => {
    const response = await apiClient.get(`/bookings/property/${propertyId}`)
    return response.data
  },

  // Player search
  searchNearbyPlayers: async (filters: {
    sport: string
    location: { lat: number; lng: number }
    radius: number
    skillLevel?: string
  }) => {
    const response = await apiClient.get('/players/search', { params: filters })
    return response.data
  },
}