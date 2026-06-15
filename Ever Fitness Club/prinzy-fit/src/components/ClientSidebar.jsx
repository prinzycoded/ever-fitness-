import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Typography, Stack, ButtonBase, Divider } from '@mui/material'
import {
  LayoutDashboard, Dumbbell, ClipboardList, TrendingUp,
  User, LogOut, Dumbbell as LogoIcon, CalendarCheck, CreditCard,
  CheckSquare, Camera, BookOpen, Clock
} from 'lucide-react'
import { useAuth } from '../stores/authStore'

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
]

const bookingLinks = [
  { to: '/coach-booking', label: 'Book a Program', icon: CalendarCheck },
  { to: '/checkout', label: 'Checkout', icon: CreditCard },
]

const trainingLinks = [
  { to: '/my-training', label: 'My Training', icon: BookOpen },
  { to: '/my-workouts', label: 'Workout Checklist', icon: CheckSquare },
]

const trackingLinks = [
  { to: '/my-sessions', label: 'My Sessions', icon: ClipboardList },
  { to: '/my-progress', label: 'My Progress', icon: TrendingUp },
  { to: '/progress-photos', label: 'Progress Photos', icon: Camera },
  { to: '/my-coach', label: 'My Coach', icon: User },
]

export default function ClientSidebar() {
  const { profile, logout } = useAuth()
  const handleLogout = useCallback(() => logout(), [logout])

  const renderLink = (l) => {
    const Icon = l.icon
    return (
      <NavLink key={l.to} to={l.to} end={l.to === '/'} style={{ textDecoration: 'none' }}>
        {({ isActive }) => (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, borderRadius: 1.5,
            bgcolor: isActive ? 'indigo.600' : 'transparent',
            color: isActive ? 'white' : 'grey.300',
            '&:hover': { bgcolor: isActive ? 'indigo.600' : 'grey.800', color: 'white' },
            transition: 'all 0.15s', cursor: 'pointer',
          }}>
            <Icon size={18} />
            <Typography variant="body2" fontWeight={500}>{l.label}</Typography>
          </Box>
        )}
      </NavLink>
    )
  }

  return (
    <Box sx={{ width: 256, bgcolor: 'grey.900', color: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid', borderColor: 'grey.700' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: 'indigo.600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoIcon size={20} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>Ever Fitness</Typography>
            <Typography variant="caption" color="grey.400">Client · {profile?.name}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, px: 1.5, py: 1.5, overflow: 'auto' }}>
        <Stack spacing={0.5}>
          {primaryLinks.map(renderLink)}
        </Stack>

        <Typography variant="caption" color="grey.500" sx={{ display: 'block', px: 1.5, py: 1, mt: 1, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          Booking
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {bookingLinks.map(renderLink)}
        </Stack>

        <Typography variant="caption" color="grey.500" sx={{ display: 'block', px: 1.5, py: 1, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          Training
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {trainingLinks.map(renderLink)}
        </Stack>

        <Typography variant="caption" color="grey.500" sx={{ display: 'block', px: 1.5, py: 1, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          Tracking
        </Typography>
        <Stack spacing={0.5}>
          {trackingLinks.map(renderLink)}
        </Stack>
      </Box>

      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid', borderColor: 'grey.700' }}>
        <ButtonBase onClick={handleLogout} sx={{ justifyContent: 'flex-start', py: 0.5, px: 0.5, borderRadius: 1, color: 'grey.400', '&:hover': { color: 'white', bgcolor: 'grey.800' }, width: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LogOut size={16} />
            <Typography variant="body2">Sign Out</Typography>
          </Stack>
        </ButtonBase>
      </Box>
    </Box>
  )
}
