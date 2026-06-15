import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Chip, Grid,
  ToggleButtonGroup, ToggleButton
} from '@mui/material'
import { useApp } from '../stores/appStore'

function WorkoutCard({ workout, clientName }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>{workout.name}</Typography>
          <Typography variant="caption" color="text.secondary">{clientName} · {workout.scheduledDate}</Typography>
        </Box>
        <Chip
          label={workout.status}
          size="small"
          color={workout.status === 'completed' ? 'success' : 'info'}
          sx={{ textTransform: 'capitalize', fontWeight: 500 }}
        />
      </Stack>
      <Stack spacing={0.75}>
        {workout.exercises?.map((ex, i) => (
          <Stack key={i} direction="row" alignItems="center" justifyContent="space-between" sx={{ bgcolor: 'grey.50', borderRadius: 1, px: 1.5, py: 1 }}>
            <Typography variant="body2" fontWeight={500}>{ex.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {ex.sets} × {ex.reps}{ex.weight > 0 ? ` @ ${ex.weight}kg` : ''}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  )
}

export default function Workouts() {
  const { workouts, clients } = useApp()
  const [filter, setFilter] = useState('all')

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]))
  const filtered = filter === 'all' ? workouts : workouts.filter(w => w.status === filter)

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Workouts</Typography>
          <Typography variant="body2" color="text.secondary">{workouts.length} total sessions</Typography>
        </Box>
      </Stack>

      <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
        {['all', 'scheduled', 'completed'].map(s => (
          <ToggleButton key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Grid container spacing={2}>
        {filtered.map(w => (
          <Grid item xs={12} sm={6} lg={4} key={w.id}>
            <WorkoutCard workout={w} clientName={clientMap[w.clientId] || 'Unknown'} />
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
              <Typography variant="body2">No workouts found.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}