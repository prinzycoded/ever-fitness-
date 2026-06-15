import { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Typography, Stack, Badge, ButtonBase, Drawer, IconButton, useMediaQuery } from '@mui/material'
import {
  LayoutDashboard, Users, Bell, LogOut, Dumbbell as LogoIcon,
  Calendar, Zap, Package, Activity, Table, GripVertical, BookOpen,
  ClipboardList, TrendingUp, Dumbbell, MessageSquareText, Menu
} from 'lucide-react'
import { useApp } from '../stores/appStore'
import { useAuth } from '../stores/authStore'

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/sessions', label: 'Sessions', icon: ClipboardList },
  { to: '/coaching-notes', label: 'Coaching Notes', icon: MessageSquareText },
]

const bookingLinks = [
  { to: '/programs', label: 'Programs', icon: Package },
  { to: '/calendar', label: 'Working Hours', icon: Calendar },
  { to: '/automation', label: 'Automation', icon: Zap },
]

const trackingLinks = [
  { to: '/activity', label: 'Activity Stream', icon: Activity },
  { to: '/adherence', label: 'Adherence', icon: Table },
]

const trainingLinks = [
  { to: '/training-builder', label: 'Training Builder', icon: GripVertical },
  { to: '/exercises', label: 'Exercise Library', icon: BookOpen },
]

function SidebarContent() {
  const { coach, unreadNotifications } = useApp()
  const { logout } = useAuth()

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
    <>
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid', borderColor: 'grey.700' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: 'indigo.600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoIcon size={20} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>Ever Fitness</Typography>
            <Typography variant="caption" color="grey.400">Coach · {coach?.name}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, px: 1.5, py: 1.5, overflow: 'auto' }}>
        <Stack spacing={0.5}>
          {primaryLinks.map(renderLink)}
        </Stack>

        <Typography variant="caption" color="grey.500" sx={{ display: 'block', px: 1.5, py: 1, mt: 1, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          Booking Flow
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {bookingLinks.map(renderLink)}
        </Stack>

        <Typography variant="caption" color="grey.500" sx={{ display: 'block', px: 1.5, py: 1, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          Tracking
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {trackingLinks.map(renderLink)}
        </Stack>

        <Typography variant="caption" color="grey.500" sx={{ display: 'block', px: 1.5, py: 1, fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          Training Builder
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {trainingLinks.map(renderLink)}
        </Stack>
      </Box>

      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid', borderColor: 'grey.700' }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'grey.400' }}>
            <Badge badgeContent={unreadNotifications} color="error" slotProps={{ badge: { sx: { fontSize: 10, minWidth: 18, height: 18 } } }}>
              <Bell size={18} />
            </Badge>
            <Typography variant="body2">Notifications</Typography>
          </Stack>
          <ButtonBase onClick={handleLogout} sx={{ justifyContent: 'flex-start', py: 0.5, px: 0.5, borderRadius: 1, color: 'grey.400', '&:hover': { color: 'white', bgcolor: 'grey.800' }, width: '100%' }}>
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

export default function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarBg = {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(rgba(15,15,25,0.92),rgba(15,15,25,0.92)),url(https://placehold.co/400x900/1e1b4b/indigo?text=)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }

  if (isDesktop) {
    return <Box sx={{ ...sidebarBg, width: 256, flexShrink: 0 }}><SidebarContent /></Box>
  }

  return (
    <>
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{ position: 'fixed', top: 8, left: 8, zIndex: 1200, bgcolor: 'grey.900', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}
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
