import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDatabase, ref, set, get, child, push, update, remove, query, orderByChild, equalTo, onValue, off } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://ever-fitness-club-default-rtdb.firebaseio.com'
const db = getDatabase(app, DATABASE_URL)

const sanitizeEmail = (email) => email.replace(/\./g, ',')

export {
  auth,
  db,
  sanitizeEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  ref,
  set,
  get,
  child,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
}
