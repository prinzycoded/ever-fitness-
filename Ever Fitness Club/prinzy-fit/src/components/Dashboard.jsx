import { useState } from 'react'
import { Box, Typography, Paper, Stack, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Users, Calendar, DollarSign, TrendingUp, X, Bell, CheckCircle } from 'lucide-react'
import { useApp } from '../stores/appStore'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>{value}</Typography>
        </Box>
        <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} className="text-white" />
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
      ...(!notification.read ? { bgcolor: 'indigo.50', mx: -2, px: 2, borderRadius: 1 } : {})
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
        <Button size="small" onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id) }} sx={{ minWidth: 'auto', fontSize: 12, fontWeight: 600, color: 'indigo.600', flexShrink: 0, p: 0 }}>
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
          <Button onClick={() => { onMarkRead(notification.id); onClose() }} size="small" variant="contained" sx={{ bgcolor: 'indigo.600' }}>
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
  const [selectedNotification, setSelectedNotification] = useState(null)

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const recentWorkouts = [...workouts].reverse().slice(0, 5)
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]))

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>Welcome back! Here's your fitness overview.</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
        <StatCard label="Active Clients" value={activeClientsCount} icon={Users} color="#6366f1" />
        <StatCard label="Upcoming Sessions" value={upcomingSessions} icon={Calendar} color="#3b82f6" />
        <StatCard label="Pending Payments" value={`$${pendingPayments.toFixed(2)}`} icon={DollarSign} color="#eab308" />
        <StatCard label="Revenue (Month)" value={`$${totalRevenue.toFixed(2)}`} icon={TrendingUp} color="#22c55e" />
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
