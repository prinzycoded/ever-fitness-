const BASE_URL = '/api'

async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (res.status === 204) return null
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error)
  }
  return res.json()
}

export const api = {
  // Coach
  getCoach: () => request('/coach'),

  // Clients
  getClients: () => request('/clients'),
  addClient: (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClientStatus: (id, status) => request(`/clients/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),

  // Workouts
  getWorkouts: () => request('/workouts'),
  addWorkout: (data) => request('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkout: (id, data) => request(`/workouts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateWorkoutStatus: (id, status) => request(`/workouts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Progress
  getProgress: () => request('/progress'),
  logProgress: (data) => request('/progress', { method: 'POST', body: JSON.stringify(data) }),

  // Payments
  getPayments: () => request('/payments'),
  addPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  addNotification: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
}
