import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, ToggleButtonGroup, ToggleButton
} from '@mui/material'
import { Trash2, UserPlus } from 'lucide-react'
import { useApp } from '../stores/appStore'

export default function Clients() {
  const { clients, updateClientStatus, deleteClient } = useApp()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? clients : clients.filter(c => c.status === filter)

  const membershipColor = (m) => {
    if (m === 'Premium') return 'secondary'
    if (m === 'Standard') return 'info'
    return 'default'
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Clients</Typography>
          <Typography variant="body2" color="text.secondary">{clients.length} total clients</Typography>
        </Box>
      </Stack>

      <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
        {['all', 'active', 'inactive'].map(s => (
          <ToggleButton key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Goal</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Membership</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Next Session</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                  <Typography variant="caption" color="text.disabled">{c.email}</Typography>
                </TableCell>
                <TableCell><Typography variant="body2">{c.goal}</Typography></TableCell>
                <TableCell>
                  <Chip label={c.membership} size="small" color={membershipColor(c.membership)} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={c.status}
                    size="small"
                    color={c.status === 'active' ? 'success' : 'error'}
                    onClick={() => updateClientStatus(c.id, c.status === 'active' ? 'inactive' : 'active')}
                    sx={{ cursor: 'pointer', fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{c.nextSession || '—'}</Typography></TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error" onClick={() => deleteClient(c.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.disabled' }}>No clients found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}