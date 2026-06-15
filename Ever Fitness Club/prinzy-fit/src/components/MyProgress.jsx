import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import { Plus } from 'lucide-react'
import { useAuth } from '../stores/authStore'
import { useApp } from '../stores/appStore'

export default function MyProgress() {
  const { profile } = useAuth()
  const { progress, logProgress } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), weight: '', bodyFat: '', notes: '' })

  const myProgress = progress.filter(p => p.clientId === profile?.id || p.clientId === profile?.email)

  const handleSubmit = () => {
    if (!form.weight) return
    logProgress({
      clientId: profile?.id,
      date: form.date,
      weight: Number(form.weight),
      bodyFat: form.bodyFat ? Number(form.bodyFat) : null,
      notes: form.notes || '',
    })
    setForm({ date: new Date().toISOString().slice(0, 10), weight: '', bodyFat: '', notes: '' })
    setShowForm(false)
  }

  const latest = myProgress[myProgress.length - 1]
  const first = myProgress[0]
  const weightChange = latest && first && latest.id !== first.id
    ? (latest.weight - first.weight).toFixed(1)
    : null

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>My Progress</Typography>
          <Typography variant="body2" color="text.secondary">Track your measurements over time</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setShowForm(!showForm)} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
          {showForm ? 'Cancel' : 'Log Progress'}
        </Button>
      </Stack>

      {showForm && (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Log Your Progress</Typography>
          <Grid container spacing={2} sx={{ mb: 1.5 }}>
            <Grid item xs={6}>
              <TextField type="date" label="Date" size="small" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Weight (kg)" type="number" size="small" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Body Fat %" type="number" size="small" value={form.bodyFat} onChange={e => setForm({ ...form, bodyFat: e.target.value })} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Notes" size="small" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} fullWidth />
            </Grid>
          </Grid>
          <Button variant="contained" size="small" onClick={handleSubmit} disabled={!form.weight} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Save Entry
          </Button>
        </Paper>
      )}

      {myProgress.length > 0 ? (
        <>
          {weightChange !== null && (
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Starting Weight</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{first.weight} kg</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Current Weight</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{latest.weight} kg</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Change</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, color: Number(weightChange) < 0 ? 'success.main' : Number(weightChange) > 0 ? 'error.main' : 'text.primary' }}>
                    {Number(weightChange) > 0 ? '+' : ''}{weightChange} kg
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Weight (kg)</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Body Fat %</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...myProgress].reverse().map(p => (
                  <TableRow key={p.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell><Typography variant="body2" fontWeight={500}>{p.date}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{p.weight}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{p.bodyFat ?? '—'}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{p.notes || '—'}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.disabled">No progress entries yet. Log your first measurement above!</Typography>
        </Paper>
      )}
    </Box>
  )
}