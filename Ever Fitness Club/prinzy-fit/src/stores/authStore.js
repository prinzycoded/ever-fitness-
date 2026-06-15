import { create } from 'zustand'
import { auth, db, sanitizeEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, ref, get, set } from '../firebase'

const snapshotHasData = (snapshot) => {
  if (!snapshot) return false
  if (typeof snapshot.exists === 'function') return snapshot.exists()
  return Boolean(snapshot.exists)
}

const cleanUndefined = (obj) => {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) result[k] = v
  }
  return result
}

const useAuthStore = create((setState) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: () => {
    const saved = sessionStorage.getItem('auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      setState({ user: parsed.user ?? null, profile: parsed.profile ?? null })
    }
    setState({ loading: false })
  },

  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const snap = await get(ref(db, `users/${sanitizeEmail(email)}`))
      if (!snapshotHasData(snap)) throw new Error('User profile not found')
      const found = snap.val()
      let profile = null
      if (found.role === 'coach') {
        const coachSnap = await get(ref(db, 'coach'))
        profile = coachSnap.val() ?? null
      } else {
        const profileId = found.profileId
        if (profileId) {
          const clientSnap = await get(ref(db, `clients/${profileId}`))
          profile = snapshotHasData(clientSnap)
            ? clientSnap.val()
            : { id: profileId, name: found.name, email: found.email }
        } else {
          profile = { name: found.name, email: found.email }
        }
      }
      const data = { user: found, profile }
      setState({ user: found, profile })
      sessionStorage.setItem('auth', JSON.stringify(data))
      return data
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
        throw new Error('Invalid email or password', { cause: err })
      }
      throw err
    }
  },

  signUp: async ({ name, email, password, role }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      if (err.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters', { cause: err })
      }
      if (err.code !== 'auth/email-already-in-use') throw err
    }
    const existingSnap = await get(ref(db, `users/${sanitizeEmail(email)}`))
    if (snapshotHasData(existingSnap)) {
      throw new Error('An account with this email already exists')
    }
    const profileId = role === 'client' ? `custom_${Date.now()}` : undefined
    const userData = cleanUndefined({ email, name, role, profileId })
    await set(ref(db, `users/${sanitizeEmail(email)}`), userData)
    let profile
    if (role === 'coach') {
      profile = { id: 1, name, email, specialization: 'General Fitness', avatar: null }
      await set(ref(db, 'coach'), profile)
    } else {
      profile = { id: profileId, name, email, goal: 'Get started', progress: 0, status: 'active' }
      await set(ref(db, `clients/${profileId}`), profile)
    }
    const data = { user: userData, profile }
    setState({ user: userData, profile })
    sessionStorage.setItem('auth', JSON.stringify(data))
    return data
  },

  logout: () => {
    signOut(auth).catch(() => {})
    setState({ user: null, profile: null })
    sessionStorage.removeItem('auth')
  },
}))

export const useAuth = () => {
  const { user, profile, loading, initialize, login, signUp, logout } = useAuthStore()
  return {
    user,
    profile,
    loading,
    initialize,
    login,
    signUp,
    logout,
    isCoach: user?.role === 'coach',
    isClient: user?.role === 'client',
  }
}
