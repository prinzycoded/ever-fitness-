import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from './stores/authStore'
import { useApp } from './stores/appStore'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Sidebar from './components/Sidebar'
import ClientSidebar from './components/ClientSidebar'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import ClientDashboard from './components/ClientDashboard'
import MyWorkouts from './components/MyWorkouts'
import MyProgress from './components/MyProgress'
import MySessions from './components/MySessions'
import MyCoach from './components/MyCoach'

import Workouts from './components/Workouts'
import Progress from './components/Progress'
import Sessions from './components/Sessions'
import BookingPrograms from './components/BookingPrograms'
import CalendarSettings from './components/CalendarSettings'
import AutomationPanel from './components/AutomationPanel'
import CoachBooking from './components/CoachBooking'
import Checkout from './components/Checkout'

import ActivityStream from './components/ActivityStream'
import AdherenceTable from './components/AdherenceTable'
import WorkoutChecklist from './components/WorkoutChecklist'
import ProgressPhotos from './components/ProgressPhotos'

import TrainingBuilder from './components/TrainingBuilder'
import ExerciseRepository from './components/ExerciseRepository'
import MyTrainingView from './components/MyTrainingView'
import CoachNotes from './components/CoachNotes'

function LoadingScreen({ message }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>{message}</Typography>
      </Box>
    </Box>
  )
}

function CoachLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Sidebar />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/sessions" element={<Sessions />} />

          <Route path="/programs" element={<BookingPrograms />} />
          <Route path="/calendar" element={<CalendarSettings />} />
          <Route path="/automation" element={<AutomationPanel />} />

          <Route path="/activity" element={<ActivityStream />} />
          <Route path="/adherence" element={<AdherenceTable />} />

          <Route path="/coaching-notes" element={<CoachNotes />} />

          <Route path="/training-builder" element={<TrainingBuilder />} />
          <Route path="/exercises" element={<ExerciseRepository />} />
        </Routes>
      </Box>
    </Box>
  )
}

function ClientLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <ClientSidebar />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/my-workouts" element={<MyWorkouts />} />
          <Route path="/my-progress" element={<MyProgress />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/my-coach" element={<MyCoach />} />

          <Route path="/coach-booking" element={<CoachBooking />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/my-training" element={<MyTrainingView />} />
          <Route path="/workout-checklist" element={<WorkoutChecklist />} />
          <Route path="/progress-photos" element={<ProgressPhotos />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default function App() {
  const { user, loading, initialize, isCoach, isClient } = useAuth()
  const { loading: dataLoading, initialize: initData, cleanup } = useApp()

  useEffect(() => { initialize() }, [initialize])
  useEffect(() => {
    if (user) {
      initData()
      return () => cleanup()
    }
  }, [user, initData, cleanup])

  if (loading) return <LoadingScreen message="Loading..." />
  if (!user) return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
  if (dataLoading) return <LoadingScreen message="Loading your dashboard..." />
  if (isCoach) return <CoachLayout />
  if (isClient) return <ClientLayout />

  return <Navigate to="/" />
}
