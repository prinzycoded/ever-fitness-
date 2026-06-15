import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Grid, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import { useApp } from '../stores/appStore'

export default function Progress() {
  const { clients, progress } = useApp()
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || '')

  const clientProgress = progress.filter(p => p.clientId === selectedClient)
  const selectedName = clients.find(c => c.id === selectedClient)?.name || ''
  const latest = clientProgress[clientProgress.length - 1]
  const first = clientProgress[0]
  const weightChange = latest && first && latest.id !== first.id
    ? (latest.weight - first.weight).toFixed(1)
    : null

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Progress Tracking</Typography>
          <Typography variant="body2" color="text.secondary">Monitor client metrics over time</Typography>
        </Box>
      </Stack>

      <TextField select label="Client" size="small" value={selectedClient} onChange={e => setSelectedClient(e.target.value)} sx={{ maxWidth: 280 }}>
        {clients.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
      </TextField>

      {clientProgress.length > 0 ? (
        <>
          {weightChange !== null && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Starting Weight</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{first.weight} kg</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Current Weight</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{latest.weight} kg</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">Change</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, color: Number(weightChange) < 0 ? 'success.main' : Number(weightChange) > 0 ? 'error.main' : 'text.primary' }}>
                    {Number(weightChange) > 0 ? '+' : ''}{weightChange} kg
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
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
                {[...clientProgress].reverse().map(p => (
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
          <Typography variant="body2" color="text.disabled">No progress entries for this client yet.</Typography>
        </Paper>
      )}
    </Box>
  )
}