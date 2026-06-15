import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Chip, Grid,
  ToggleButtonGroup, ToggleButton
} from '@mui/material'
import { useAuth } from '../stores/authStore'
import { useApp } from '../stores/appStore'

export default function MyWorkouts() {
  const { profile } = useAuth()
  const { workouts } = useApp()
  const [filter, setFilter] = useState('all')

  const myWorkouts = workouts.filter(w => w.clientId === profile?.id || w.clientId === profile?.email)
  const filtered = filter === 'all' ? myWorkouts : myWorkouts.filter(w => w.status === filter)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>My Workouts</Typography>
        <Typography variant="body2" color="text.secondary">{myWorkouts.length} total workouts assigned</Typography>
      </Box>

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
                  <Typography variant="caption" color="text.secondary">{w.scheduledDate}</Typography>
                </Box>
                <Chip label={w.status} size="small" color={w.status === 'completed' ? 'success' : 'info'} sx={{ textTransform: 'capitalize', fontWeight: 500 }} />
              </Stack>
              <Stack spacing={0.75}>
                {w.exercises?.length > 0 ? w.exercises.map((ex, i) => (
                  <Stack key={i} direction="row" alignItems="center" justifyContent="space-between" sx={{ bgcolor: 'grey.50', borderRadius: 1, px: 1.5, py: 1, overflow: 'hidden' }}>
                    <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>{ex.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ex.actualSets ?? ex.sets} x {ex.actualReps ?? ex.reps}{(ex.actualWeight ?? ex.weight) > 0 ? ` @ ${ex.actualWeight ?? ex.weight}kg` : ''}
                    </Typography>
                  </Stack>
                )) : (
                  <Typography variant="caption" color="text.disabled" fontStyle="italic">No exercises specified</Typography>
                )}
              </Stack>
            </Paper>
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