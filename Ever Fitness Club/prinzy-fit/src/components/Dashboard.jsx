import { useState } from 'react'
import { Box, Typography, Paper, Stack, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Users, Calendar, DollarSign, TrendingUp, X, Bell, CheckCircle } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { useNavigate } from 'react-router-dom'

const STAT_GRADIENTS = {
  'Active Clients': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  'Upcoming Sessions': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  'Pending Payments': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'Revenue (Month)': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
}

function StatCard({ label, value, icon: Icon, onClick }) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2.5, borderRadius: 2.5, border: '1px solid', borderColor: 'divider',
        transition: 'all 0.2s', cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderColor: 'primary.light' } : {},
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>{value}</Typography>
        </Box>
        <Box sx={{
          width: 40, height: 40, borderRadius: 1.5, ml: 1.5,
          background: STAT_GRADIENTS[label] || 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${STAT_GRADIENTS[label] ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.2)'}`,
        }}>
          <Icon size={18} color="white" />
        </Box>
      </Stack>
    </Paper>
  )
}

function RecentWorkout({ workout, clientName }) {
  const statusColors = { completed: 'success', scheduled: 'info' }
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
      <Box>
        <Typography variant="body2" fontWeight={600} color="text.primary">{workout.name}</Typography>
        <Typography variant="caption" color="text.secondary">{clientName} · {workout.scheduledDate}</Typography>
      </Box>
      <Chip label={workout.status} size="small" color={statusColors[workout.status] || 'default'} sx={{ textTransform: 'capitalize', fontWeight: 500 }} />
    </Stack>
  )
}

const TYPE_CONFIG = { workout: { label: 'Workout', color: 'info' }, payment: { label: 'Payment', color: 'warning' }, progress: { label: 'Progress', color: 'success' }, session: { label: 'Session', color: 'secondary' }, booking: { label: 'Booking', color: 'primary' } }

function NotificationItem({ notification, onMarkRead, onClick }) {
  const config = TYPE_CONFIG[notification.type] || { label: 'Notification', color: 'grey' }
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{
      py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 },
      cursor: 'pointer', transition: 'background 0.15s',
      '&:hover': { bgcolor: 'action.hover' },
      ...(!notification.read ? { bgcolor: 'rgba(109, 40, 217, 0.06)', mx: -2, px: 2, borderRadius: 1 } : {})
    }} onClick={() => onClick(notification)}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: `${config.color}.main`, mt: 0.5, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          ...(!notification.read ? { fontWeight: 600, color: 'text.primary' } : {})
        }}>{notification.message}</Typography>
        <Typography variant="caption" color="text.disabled">{notification.time}</Typography>
      </Box>
      {!notification.read && (
          <Button size="small" onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id) }} sx={{ minWidth: 'auto', fontSize: 12, fontWeight: 600, color: 'primary.main', flexShrink: 0, p: 0 }}>
          <X size={14} />
        </Button>
      )}
    </Stack>
  )
}

function NotificationDetail({ notification, open, onClose, onMarkRead }) {
  if (!notification) return null
  const config = TYPE_CONFIG[notification.type] || { label: 'Notification', color: 'grey' }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: `${config.color}.main` }} />
        <Typography variant="h6" fontWeight={600}>{config.label} Details</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.disabled" fontWeight={600}>MESSAGE</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>{notification.message}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled" fontWeight={600}>TIME</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{notification.time}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled" fontWeight={600}>STATUS</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
              {notification.read ? <CheckCircle size={16} color="#22c55e" /> : <Bell size={16} color="#6366f1" />}
              <Typography variant="body2">{notification.read ? 'Read' : 'Unread'}</Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        {!notification.read && (
            <Button onClick={() => { onMarkRead(notification.id); onClose() }} size="small" variant="contained">
            Mark as Read
          </Button>
        )}
        <Button onClick={onClose} size="small">Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default function Dashboard() {
  const { clients, workouts, notifications, payments, activeClientsCount, upcomingSessions, pendingPayments, unreadNotifications, markNotificationRead } = useApp()
  const navigate = useNavigate()
  const [selectedNotification, setSelectedNotification] = useState(null)

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const recentWorkouts = [...workouts].reverse().slice(0, 5)
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]))

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>Welcome back! Here's your fitness overview.</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
        <StatCard label="Active Clients" value={activeClientsCount} icon={Users} onClick={() => navigate('/clients')} />
        <StatCard label="Upcoming Sessions" value={upcomingSessions} icon={Calendar} onClick={() => navigate('/sessions')} />
        <StatCard label="Pending Payments" value={`$${pendingPayments.toFixed(2)}`} icon={DollarSign} onClick={() => navigate('/activity')} />
        <StatCard label="Revenue (Month)" value={`$${totalRevenue.toFixed(2)}`} icon={TrendingUp} onClick={() => navigate('/activity')} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Recent Workouts</Typography>
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map(w => <RecentWorkout key={w.id} workout={w} clientName={clientMap[w.clientId] || 'Unknown'} />)
          ) : (
            <Typography variant="body2" color="text.disabled">No workouts scheduled yet.</Typography>
          )}
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Notifications</Typography>
            {unreadNotifications > 0 && (
              <Chip label={`${unreadNotifications} new`} size="small" color="primary" sx={{ fontWeight: 600 }} />
            )}
          </Stack>
          {notifications.length > 0 ? (
            notifications.map(n => <NotificationItem key={n.id} notification={n} onMarkRead={markNotificationRead} onClick={setSelectedNotification} />)
          ) : (
            <Typography variant="body2" color="text.disabled">No notifications.</Typography>
          )}
        </Paper>
      </Box>

      <NotificationDetail notification={selectedNotification} open={!!selectedNotification} onClose={() => setSelectedNotification(null)} onMarkRead={markNotificationRead} />
    </Box>
  )
}
