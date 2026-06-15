import { create } from 'zustand'
import { db, ref, get, set, update, remove, push, onValue, off } from '../firebase'

const toArray = (obj) => (obj ? Object.values(obj) : [])

const cleanUndefined = (obj) => {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) result[k] = v
  }
  return result
}

const PATHS = [
  'clients', 'workouts', 'progress', 'payments', 'notifications',
  'programs', 'workingHours', 'automationRules', 'bookings',
  'activityLog', 'adherence', 'exercises', 'trainingPlans',
  'coachingNotes',
]

const useAppStore = create((setState, getState) => ({
  coach: null,
  clients: [],
  workouts: [],
  progress: [],
  payments: [],
  notifications: [],
  loading: true,
  error: null,

  programs: [],
  workingHours: [],
  automationRules: [],
  bookings: [],
  activityLog: [],
  adherence: [],
  exercises: [],
  trainingPlans: [],
  coachingNotes: [],

  _unsubscribes: [],

  initialize: () => {
    const unsubs = PATHS.map(path => {
      return onValue(ref(db, path), (snapshot) => {
        const val = snapshot.val()
        setState({ [path]: toArray(val), loading: false })
      }, (err) => {
        setState({ [path]: [], loading: false, error: err.message })
      })
    })

    const coachUnsub = onValue(ref(db, 'coach'), (snapshot) => {
      setState({ coach: snapshot.val() || null, loading: false })
    }, (err) => {
      setState({ loading: false, error: err.message })
    })

    setState({ _unsubscribes: [...unsubs, coachUnsub], loading: false })
  },

  cleanup: () => {
    getState()._unsubscribes.forEach(unsub => unsub())
    setState({ _unsubscribes: [] })
  },

  addClient: async (client) => {
    const state = getState()
    const id = `c_${Date.now()}`
    const created = { ...client, id }
    await set(ref(db, `clients/${id}`), cleanUndefined(created))
    setState({ clients: [...state.clients, created] })
    return created
  },

  updateClientStatus: async (id, status) => {
    const state = getState()
    await update(ref(db, `clients/${id}`), { status })
    setState({ clients: state.clients.map(c => (c.id === id ? { ...c, status } : c)) })
    return { id, status }
  },

  deleteClient: async (id) => {
    const state = getState()
    await remove(ref(db, `clients/${id}`))
    setState({
      clients: state.clients.filter(c => c.id !== id),
      workouts: state.workouts.filter(w => w.clientId !== id),
      progress: state.progress.filter(p => p.clientId !== id),
    })
    return id
  },

  addWorkout: async (workout) => {
    const state = getState()
    const id = `w_${Date.now()}`
    const created = { ...workout, id }
    await set(ref(db, `workouts/${id}`), cleanUndefined(created))
    setState({ workouts: [...state.workouts, created] })
    return created
  },

  updateWorkout: async (id, data) => {
    const state = getState()
    await update(ref(db, `workouts/${id}`), cleanUndefined(data))
    setState({ workouts: state.workouts.map(w => (w.id === id ? { ...w, ...data } : w)) })
    return { id, ...data }
  },

  updateWorkoutStatus: async (id, status) => {
    const state = getState()
    await update(ref(db, `workouts/${id}`), { status })
    setState({ workouts: state.workouts.map(w => (w.id === id ? { ...w, status } : w)) })
    return { id, status }
  },

  addNotification: async (data) => {
    const state = getState()
    const id = `n_${Date.now()}`
    const created = { id, read: false, time: new Date().toISOString(), ...data }
    await set(ref(db, `notifications/${id}`), cleanUndefined(created))
    setState({ notifications: [created, ...state.notifications] })
    return created
  },

  logProgress: async (entry) => {
    const state = getState()
    const id = `p_${Date.now()}`
    const created = { id, ...entry }
    await set(ref(db, `progress/${id}`), cleanUndefined(created))
    setState({ progress: [...state.progress, created] })
    return created
  },

  markNotificationRead: async (id) => {
    const state = getState()
    await update(ref(db, `notifications/${id}`), { read: true })
    setState({ notifications: state.notifications.map(n => (n.id === id ? { ...n, read: true } : n)) })
    return id
  },

  addPayment: async (payment) => {
    const state = getState()
    const id = `pay_${Date.now()}`
    const created = { id, ...payment }
    await set(ref(db, `payments/${id}`), cleanUndefined(created))
    setState({ payments: [...state.payments, created] })
    return created
  },

  // ========== BOOKING FLOW ==========

  addProgram: async (program) => {
    const state = getState()
    const id = `prog_${Date.now()}`
    const created = { id, ...program }
    await set(ref(db, `programs/${id}`), cleanUndefined(created))
    setState({ programs: [...state.programs, created] })
    return created
  },

  updateProgram: async (id, data) => {
    const state = getState()
    await update(ref(db, `programs/${id}`), cleanUndefined(data))
    setState({ programs: state.programs.map(p => (p.id === id ? { ...p, ...data } : p)) })
    return { id, ...data }
  },

  deleteProgram: async (id) => {
    const state = getState()
    await remove(ref(db, `programs/${id}`))
    setState({ programs: state.programs.filter(p => p.id !== id) })
    return id
  },

  saveWorkingHours: async (slots) => {
    const state = getState()
    await set(ref(db, 'workingHours'), slots)
    setState({ workingHours: slots })
    return slots
  },

  addAutomationRule: async (rule) => {
    const state = getState()
    const id = `rule_${Date.now()}`
    const created = { id, ...rule }
    await set(ref(db, `automationRules/${id}`), cleanUndefined(created))
    setState({ automationRules: [...state.automationRules, created] })
    return created
  },

  updateAutomationRule: async (id, data) => {
    const state = getState()
    await update(ref(db, `automationRules/${id}`), cleanUndefined(data))
    setState({ automationRules: state.automationRules.map(r => (r.id === id ? { ...r, ...data } : r)) })
    return { id, ...data }
  },

  deleteAutomationRule: async (id) => {
    const state = getState()
    await remove(ref(db, `automationRules/${id}`))
    setState({ automationRules: state.automationRules.filter(r => r.id !== id) })
    return id
  },

  addBooking: async (booking) => {
    const state = getState()
    const id = `book_${Date.now()}`
    const created = { id, createdAt: new Date().toISOString(), status: 'pending', ...booking }
    await set(ref(db, `bookings/${id}`), cleanUndefined(created))
    setState({ bookings: [...state.bookings, created] })
    await getState().addActivityLog({
      type: 'booking',
      clientId: booking.clientId,
      clientName: booking.clientName,
      message: `${booking.clientName} booked "${booking.programName}"`,
    })
    return created
  },

  updateBookingStatus: async (id, status) => {
    const state = getState()
    await update(ref(db, `bookings/${id}`), { status })
    setState({ bookings: state.bookings.map(b => (b.id === id ? { ...b, status } : b)) })
    return { id, status }
  },

  // ========== TRACKING VIEW ==========

  addActivityLog: async (entry) => {
    const state = getState()
    const id = `act_${Date.now()}`
    const created = { id, timestamp: new Date().toISOString(), ...entry }
    await set(ref(db, `activityLog/${id}`), cleanUndefined(created))
    setState({ activityLog: [created, ...state.activityLog] })
    return created
  },

  updateAdherence: async (clientId, data) => {
    const state = getState()
    const existing = state.adherence.find(a => a.clientId === clientId)
    if (existing) {
      await update(ref(db, `adherence/${existing.id}`), cleanUndefined(data))
      setState({ adherence: state.adherence.map(a => (a.clientId === clientId ? { ...a, ...data } : a)) })
    } else {
      const id = `adh_${Date.now()}`
      const created = { id, clientId, ...data }
      await set(ref(db, `adherence/${id}`), cleanUndefined(created))
      setState({ adherence: [...state.adherence, created] })
    }
  },

  addProgressPhoto: async (photo) => {
    const state = getState()
    const id = `photo_${Date.now()}`
    const created = { id, uploadedAt: new Date().toISOString(), ...photo }
    await set(ref(db, `progressPhotos/${id}`), cleanUndefined(created))
    await getState().addActivityLog({
      type: 'photo',
      clientId: photo.clientId,
      clientName: photo.clientName,
      message: `${photo.clientName} uploaded a progress photo`,
    })
    return created
  },

  // ========== TRAINING BUILDER ==========

  addExercise: async (exercise) => {
    const state = getState()
    const id = `ex_${Date.now()}`
    const created = { id, ...exercise }
    await set(ref(db, `exercises/${id}`), cleanUndefined(created))
    setState({ exercises: [...state.exercises, created] })
    return created
  },

  updateExercise: async (id, data) => {
    const state = getState()
    await update(ref(db, `exercises/${id}`), cleanUndefined(data))
    setState({ exercises: state.exercises.map(e => (e.id === id ? { ...e, ...data } : e)) })
    return { id, ...data }
  },

  deleteExercise: async (id) => {
    const state = getState()
    await remove(ref(db, `exercises/${id}`))
    setState({ exercises: state.exercises.filter(e => e.id !== id) })
    return id
  },

  saveTrainingPlan: async (plan) => {
    const state = getState()
    const id = plan.id || `plan_${Date.now()}`
    const created = { id, updatedAt: new Date().toISOString(), ...plan }
    await set(ref(db, `trainingPlans/${id}`), cleanUndefined(created))
    if (plan.id) {
      setState({ trainingPlans: state.trainingPlans.map(p => (p.id === id ? { ...p, ...created } : p)) })
    } else {
      setState({ trainingPlans: [...state.trainingPlans, created] })
    }
    return created
  },

  deleteTrainingPlan: async (id) => {
    const state = getState()
    await remove(ref(db, `trainingPlans/${id}`))
    setState({ trainingPlans: state.trainingPlans.filter(p => p.id !== id) })
    return id
  },

  // ========== COACHING NOTES ==========

  addCoachingNote: async (note) => {
    const state = getState()
    const id = `cn_${Date.now()}`
    const created = { id, createdAt: new Date().toISOString(), ...note }
    await set(ref(db, `coachingNotes/${id}`), cleanUndefined(created))
    setState({ coachingNotes: [...state.coachingNotes, created] })
    return created
  },

  deleteCoachingNote: async (id) => {
    const state = getState()
    await remove(ref(db, `coachingNotes/${id}`))
    setState({ coachingNotes: state.coachingNotes.filter(n => n.id !== id) })
    return id
  },
}))

export const useApp = () => {
  const state = useAppStore()
  return {
    ...state,
    activeClientsCount: state.clients.filter(c => c.status === 'active').length,
    upcomingSessions: state.workouts.filter(w => w.status === 'scheduled').length,
    pendingPayments: state.payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    unreadNotifications: state.notifications.filter(n => !n.read).length,
  }
}
