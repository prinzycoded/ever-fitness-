import { useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Typography, Stack, Badge, ButtonBase, Drawer, IconButton, useMediaQuery } from '@mui/material'
import {
  LayoutDashboard, Users, Bell, LogOut, Dumbbell as LogoIcon,
  Calendar, Zap, Package, Activity, Table, GripVertical, BookOpen,
  ClipboardList, TrendingUp, Dumbbell, MessageSquareText, Menu, Moon, Sun
} from 'lucide-react'
import { useApp } from '../stores/appStore'
import { useAuth } from '../stores/authStore'
import { useThemeMode } from '../stores/themeStore'

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
            color: isActive ? 'white' : (isDark ? 'grey.200' : 'grey.800'),
            '&:hover': { bgcolor: isActive ? 'primary.main' : (isDark ? 'grey.700' : 'grey.100'), color: isActive ? 'white' : (isDark ? 'white' : 'grey.900'), transform: 'translateX(2px)' },
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
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>Ever Fitness</Typography>
            <Typography variant="caption" color={isDark ? 'grey.300' : 'grey.600'} sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Coach · {coach?.name}</Typography>
          </Box>
          <IconButton onClick={toggleTheme} size="small" sx={{ color: isDark ? 'grey.300' : 'grey.600', '&:hover': { color: isDark ? 'white' : 'grey.900' } }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, px: { xs: 1, md: 1.5 }, py: { xs: 1, md: 1.5 }, overflow: 'auto' }}>
        <Stack spacing={0.5}>
          {primaryLinks.map(renderLink)}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1, md: 1.5 }, pt: 2, pb: 0.75, mt: 0.5 }}>
          <Box sx={{ width: 2, height: 10, borderRadius: 1, bgcolor: 'primary.main' }} />
          <Typography variant="caption" color={isDark ? 'grey.400' : 'grey.600'} sx={{ fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Booking Flow
          </Typography>
        </Box>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {bookingLinks.map(renderLink)}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1, md: 1.5 }, pt: 1.5, pb: 0.75 }}>
          <Box sx={{ width: 2, height: 10, borderRadius: 1, bgcolor: 'secondary.main' }} />
          <Typography variant="caption" color={isDark ? 'grey.400' : 'grey.600'} sx={{ fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Tracking
          </Typography>
        </Box>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {trackingLinks.map(renderLink)}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1, md: 1.5 }, pt: 1.5, pb: 0.75 }}>
          <Box sx={{ width: 2, height: 10, borderRadius: 1, bgcolor: '#10b981' }} />
          <Typography variant="caption" color={isDark ? 'grey.400' : 'grey.600'} sx={{ fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Training Builder
          </Typography>
        </Box>
        <Stack spacing={0.5} sx={{ mb: 0.5 }}>
          {trainingLinks.map(renderLink)}
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, md: 2.5 }, py: { xs: 1.5, md: 2 }, borderTop: '1px solid', borderColor: isDark ? 'grey.700' : 'grey.200' }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: isDark ? 'grey.300' : 'grey.700' }}>
            <Badge badgeContent={unreadNotifications} color="error" slotProps={{ badge: { sx: { fontSize: 10, minWidth: 18, height: 18 } } }}>
              <Bell size={18} />
            </Badge>
            <Typography variant="body2">Notifications</Typography>
          </Stack>
          <ButtonBase onClick={handleLogout} sx={{ justifyContent: 'flex-start', py: 0.5, px: 0.5, borderRadius: 1, color: isDark ? 'grey.300' : 'grey.700', '&:hover': { color: isDark ? 'white' : 'grey.900', bgcolor: isDark ? 'grey.700' : 'grey.100' }, width: '100%' }}>
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
  const { isDark } = useThemeMode()

  const sidebarBg = isDark ? {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    background: 'linear-gradient(180deg, rgba(10,10,20,0.97) 0%, rgba(18,18,35,0.95) 50%, rgba(10,10,20,0.97) 100%), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80) center/cover',
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
    return <Box sx={{ ...sidebarBg, width: 256, flexShrink: 0 }}><SidebarContent /></Box>
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
