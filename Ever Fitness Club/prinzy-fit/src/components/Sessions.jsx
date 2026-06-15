import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Chip, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  ToggleButtonGroup, ToggleButton
} from '@mui/material'
import { CheckCircle } from 'lucide-react'
import { useApp } from '../stores/appStore'

function SessionCard({ workout, clientName, onComplete }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>{workout.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {clientName} · {workout.scheduledDate}{workout.completedDate ? ` (completed ${workout.completedDate})` : ''}
          </Typography>
        </Box>
        <Chip
          label={workout.status === 'completed' ? 'Done' : 'Scheduled'}
          size="small"
          color={workout.status === 'completed' ? 'success' : 'info'}
          sx={{ fontWeight: 500 }}
        />
      </Stack>
      <Stack spacing={0.75}>
        {workout.exercises?.map((ex, i) => (
          <Stack key={i} direction="row" alignItems="center" justifyContent="space-between" sx={{ bgcolor: 'grey.50', borderRadius: 1, px: 1.5, py: 1, overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>{ex.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {ex.actualSets ?? ex.sets} × {ex.actualReps ?? ex.reps}{(ex.actualWeight ?? ex.weight) > 0 ? ` @ ${ex.actualWeight ?? ex.weight}kg` : ''}
            </Typography>
          </Stack>
        ))}
        {(!workout.exercises || workout.exercises.length === 0) && (
          <Typography variant="caption" color="text.disabled" fontStyle="italic">No exercises logged</Typography>
        )}
      </Stack>
      {workout.completionNotes && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'block' }}>
          {workout.completionNotes}
        </Typography>
      )}
      {workout.status !== 'completed' && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<CheckCircle size={14} />}
          onClick={() => onComplete(workout)}
          sx={{ mt: 1.5, textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
        >
          Mark Complete
        </Button>
      )}
    </Paper>
  )
}

function CompleteDialog({ open, workout, onClose, onConfirm }) {
  const [notes, setNotes] = useState('')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Complete Session</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.disabled" fontWeight={600}>WORKOUT</Typography>
            <Typography variant="body1" fontWeight={600}>{workout?.name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled" fontWeight={600}>CLIENT</Typography>
            <Typography variant="body2">{workout?.clientName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled" fontWeight={600}>DATE</Typography>
            <Typography variant="body2">{workout?.scheduledDate}</Typography>
          </Box>
          <TextField
            label="Completion Notes (optional)"
            multiline
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes on how the session went..."
            size="small"
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button
          onClick={() => { onConfirm(workout?.id, notes); setNotes(''); onClose() }}
          variant="contained"
          size="small"
          startIcon={<CheckCircle size={14} />}
        >
          Mark Complete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function Sessions() {
  const { workouts, clients, updateWorkout } = useApp()
  const [filter, setFilter] = useState('all')
  const [completeTarget, setCompleteTarget] = useState(null)

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.name]))
  const filtered = filter === 'all' ? workouts : workouts.filter(w => w.status === filter)
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = workouts.filter(w => w.scheduledDate === today && w.status === 'scheduled')
  const completedToday = workouts.filter(w => w.status === 'completed' && (w.completedDate === today || w.scheduledDate === today))

  const handleComplete = async (id, notes) => {
    await updateWorkout(id, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      completionNotes: notes || '',
    })
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Sessions</Typography>
          <Typography variant="body2" color="text.secondary">{workouts.length} total sessions</Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Today's Sessions</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{todaySessions.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Completed Today</Typography>
            <Typography variant="h4" fontWeight={700} color="success.main" sx={{ mt: 0.5 }}>{completedToday.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Upcoming</Typography>
            <Typography variant="h4" fontWeight={700} color="info.main" sx={{ mt: 0.5 }}>{workouts.filter(w => w.status === 'scheduled').length}</Typography>
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
            <SessionCard
              workout={w}
              clientName={clientMap[w.clientId] || 'Unknown'}
              onComplete={(workout) => setCompleteTarget({ ...workout, clientName: clientMap[w.clientId] || 'Unknown' })}
            />
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

      <CompleteDialog
        open={!!completeTarget}
        workout={completeTarget}
        onClose={() => setCompleteTarget(null)}
        onConfirm={handleComplete}
      />
    </Box>
  )
}