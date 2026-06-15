import { useState } from 'react'
import { Box, Typography, Paper, Stack, Chip, Avatar, IconButton } from '@mui/material'
import { RefreshCw, CalendarCheck, Camera, CreditCard, Dumbbell, UserPlus, Bell } from 'lucide-react'
import { useApp } from '../stores/appStore'

const TYPE_CONFIG = {
  booking: { icon: CalendarCheck, color: 'indigo', label: 'Booking' },
  photo: { icon: Camera, color: 'pink', label: 'Photo' },
  payment: { icon: CreditCard, color: 'green', label: 'Payment' },
  workout: { icon: Dumbbell, color: 'amber', label: 'Workout' },
  client: { icon: UserPlus, color: 'blue', label: 'Client' },
  notification: { icon: Bell, color: 'purple', label: 'Notification' },
}

function getRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function ActivityStream() {
  const { activityLog } = useApp()
  const [filter, setFilter] = useState('all')

  const activities = activityLog
  const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter)

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={700}>Activity Stream</Typography>
        <IconButton size="small"><RefreshCw size={16} /></IconButton>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
        <Chip label="All" size="small" variant={filter === 'all' ? 'filled' : 'outlined'} onClick={() => setFilter('all')} color={filter === 'all' ? 'indigo' : 'default'} />
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <Chip key={key} label={cfg.label} size="small" variant={filter === key ? 'filled' : 'outlined'} onClick={() => setFilter(key)} color={filter === key ? cfg.color : 'default'} />
        ))}
      </Stack>

      <Stack spacing={1}>
        {filtered.map((entry) => {
          const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.notification
          const Icon = cfg.icon
          return (
            <Paper key={entry.id} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: `${cfg.color}.100`, color: `${cfg.color}.600` }}>
                <Icon size={18} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{entry.message}</Typography>
                <Typography variant="caption" color="text.disabled">{getRelativeTime(entry.timestamp)}</Typography>
              </Box>
              <Chip label={cfg.label} size="small" variant="outlined" sx={{ fontSize: 10 }} />
            </Paper>
          )
        })}
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 4 }}>No activity yet.</Typography>
        )}
      </Stack>
    </Box>
  )
}
