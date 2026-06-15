import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Chip, Grid,
  ToggleButtonGroup, ToggleButton
} from '@mui/material'
import { useAuth } from '../stores/authStore'
import { useApp } from '../stores/appStore'

export default function MySessions() {
  const { profile } = useAuth()
  const { workouts } = useApp()
  const [filter, setFilter] = useState('all')

  const myWorkouts = workouts.filter(w => w.clientId === profile?.id || w.clientId === profile?.email)
  const filtered = filter === 'all' ? myWorkouts : myWorkouts.filter(w => w.status === filter)
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = myWorkouts.filter(w => w.scheduledDate === today && w.status === 'scheduled')

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>My Sessions</Typography>
        <Typography variant="body2" color="text.secondary">View your scheduled and completed sessions</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Today's Sessions</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{todaySessions.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Completed</Typography>
            <Typography variant="h4" fontWeight={700} color="success.main" sx={{ mt: 0.5 }}>{myWorkouts.filter(w => w.status === 'completed').length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Upcoming</Typography>
            <Typography variant="h4" fontWeight={700} color="info.main" sx={{ mt: 0.5 }}>{myWorkouts.filter(w => w.status === 'scheduled').length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
        {['all', 'scheduled', 'completed'].map(s => (
          <ToggleButton key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Grid container spacing={2}>
        {filtered.map(w => (
          <Grid item xs={12} sm={6} lg={4} key={w.id}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>{w.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{w.scheduledDate}{w.completedDate ? ` (completed ${w.completedDate})` : ''}</Typography>
                </Box>
                <Chip label={w.status === 'completed' ? 'Done' : 'Scheduled'} size="small" color={w.status === 'completed' ? 'success' : 'info'} sx={{ fontWeight: 500 }} />
              </Stack>
              <Stack spacing={0.75}>
                {w.exercises?.length > 0 ? w.exercises.map((ex, i) => (
                  <Stack key={i} direction="row" alignItems="center" justifyContent="space-between" sx={{ bgcolor: 'grey.50', borderRadius: 1, px: 1.5, py: 1 }}>
                    <Typography variant="body2" fontWeight={500}>{ex.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ex.actualSets ?? ex.sets} x {ex.actualReps ?? ex.reps}{(ex.actualWeight ?? ex.weight) > 0 ? ` @ ${ex.actualWeight ?? ex.weight}kg` : ''}
                    </Typography>
                  </Stack>
                )) : (
                  <Typography variant="caption" color="text.disabled" fontStyle="italic">No exercises logged</Typography>
                )}
              </Stack>
              {w.completionNotes && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'block' }}>
                  {w.completionNotes}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
              <Typography variant="body2">No sessions found.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}