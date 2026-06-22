import { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Typography, Stack, ButtonBase, Drawer, IconButton, useMediaQuery, Tooltip } from '@mui/material'
import {
  LayoutDashboard, ClipboardList, TrendingUp,
  User, LogOut, Dumbbell as LogoIcon, CalendarCheck, CreditCard,
  CheckSquare, Camera, BookOpen, Menu, Moon, Sun
} from 'lucide-react'
import { useAuth } from '../stores/authStore'
import { useThemeMode } from '../stores/themeStore'

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

function SidebarContent() {
  const { profile, logout } = useAuth()
  const { isDark, toggleTheme } = useThemeMode()
  const handleLogout = useCallback(() => logout(), [logout])

  const renderLink = (l) => {
    const Icon = l.icon
    return (
      <NavLink key={l.to} to={l.to} end={l.to === '/'} style={{ textDecoration: 'none' }}>
        {({ isActive }) => (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, borderRadius: 1.5,
            bgcolor: isActive ? 'primary.main' : 'transparent',
            color: isActive ? 'white' : (isDark ? 'grey.300' : 'grey.700'),
            '&:hover': { bgcolor: isActive ? 'primary.main' : (isDark ? 'grey.800' : 'grey.100'), color: isActive ? 'white' : (isDark ? 'white' : 'grey.900'), transform: 'translateX(2px)' },
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
    <>
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: isDark ? 'grey.700' : 'grey.200' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 }, borderRadius: 1.5, bgcolor: 'indigo.600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoIcon size={20} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>Ever Fitness</Typography>
            <Typography variant="caption" color={isDark ? 'grey.400' : 'grey.500'} sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Client · {profile?.name}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, px: { xs: 1, md: 1.5 }, py: { xs: 1, md: 1.5 }, overflow: 'auto' }}>
        <Stack spacing={0.5}>
          {primaryLinks.map(renderLink)}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1, md: 1.5 }, pt: 2, pb: 0.75, mt: 0.5 }}>
          <Box sx={{ width: 2, height: 10, borderRadius: 1, bgcolor: 'primary.main' }} />
          <Typography variant="caption" color={isDark ? 'grey.500' : 'grey.500'} sx={{ fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Booking
          </Typography>
        </Box>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {bookingLinks.map(renderLink)}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1, md: 1.5 }, pt: 1.5, pb: 0.75 }}>
          <Box sx={{ width: 2, height: 10, borderRadius: 1, bgcolor: 'secondary.main' }} />
          <Typography variant="caption" color={isDark ? 'grey.500' : 'grey.500'} sx={{ fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Training
          </Typography>
        </Box>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {trainingLinks.map(renderLink)}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1, md: 1.5 }, pt: 1.5, pb: 0.75 }}>
          <Box sx={{ width: 2, height: 10, borderRadius: 1, bgcolor: '#10b981' }} />
          <Typography variant="caption" color={isDark ? 'grey.500' : 'grey.500'} sx={{ fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Tracking
          </Typography>
        </Box>
        <Stack spacing={0.5}>
          {trackingLinks.map(renderLink)}
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, md: 2.5 }, py: { xs: 1.5, md: 2 }, borderTop: '1px solid', borderColor: isDark ? 'grey.700' : 'grey.200' }}>
        <Stack spacing={1.5}>
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} placement="right">
            <ButtonBase onClick={toggleTheme} sx={{ justifyContent: 'flex-start', py: 0.5, px: 0.5, borderRadius: 1, color: isDark ? 'grey.400' : 'grey.600', '&:hover': { color: isDark ? 'white' : 'grey.900', bgcolor: isDark ? 'grey.800' : 'grey.200' }, width: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <Typography variant="body2">{isDark ? 'Light Mode' : 'Dark Mode'}</Typography>
              </Stack>
            </ButtonBase>
          </Tooltip>
          <ButtonBase onClick={handleLogout} sx={{ justifyContent: 'flex-start', py: 0.5, px: 0.5, borderRadius: 1, color: isDark ? 'grey.400' : 'grey.600', '&:hover': { color: isDark ? 'white' : 'grey.900', bgcolor: isDark ? 'grey.800' : 'grey.200' }, width: '100%' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LogOut size={16} />
              <Typography variant="body2">Sign Out</Typography>
            </Stack>
          </ButtonBase>
        </Stack>
      </Box>
    </>
  )
}

export default function ClientSidebar() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isDark } = useThemeMode()

  const sidebarBg = isDark ? {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    background: 'linear-gradient(180deg, rgba(15,15,26,0.92) 0%, rgba(26,26,46,0.85) 50%, rgba(15,15,26,0.92) 100%), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80) center/cover',
  } : {
    color: 'text.primary',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    background: '#ffffff',
    borderRight: '1px solid',
    borderColor: 'divider',
  }

  if (isDesktop) {
    return <Box sx={{ width: 256, flexShrink: 0, ...sidebarBg }}><SidebarContent /></Box>
  }

  return (
    <>
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1200, bgcolor: isDark ? 'grey.900' : 'grey.800', color: 'white', '&:hover': { bgcolor: isDark ? 'grey.800' : 'grey.700' } }}
      >
        <Menu size={20} />
      </IconButton>
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 256, ...sidebarBg } }}
      >
        <SidebarContent />
      </Drawer>
    </>
  )
}
