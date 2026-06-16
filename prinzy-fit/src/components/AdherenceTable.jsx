import { useState, useMemo } from 'react'
import { Box, Typography, Paper, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Avatar, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react'
import { useApp } from '../stores/appStore'

const STATUS_CONFIG = {
  adherent: { label: 'Adherent', color: 'success', icon: CheckCircle },
  partial: { label: 'Partial', color: 'warning', icon: AlertCircle },
  missed: { label: 'Missed', color: 'error', icon: XCircle },
}

export default function AdherenceTable() {
  const { clients, adherence } = useApp()
  const [period, setPeriod] = useState('month')

  const data = useMemo(() => {
    if (adherence.length > 0) return adherence
    const statuses = ['adherent', 'partial', 'missed']
    return clients.map((c, i) => ({
      clientId: c.id,
      clientName: c.name,
      rate: 60 + ((i * 17) % 40),
      status: statuses[i % 3],
      completed: 5 + ((i * 7) % 20),
      total: 25,
      streak: i % 10,
    }))
  }, [adherence, clients])

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const statuses = ['adherent', 'partial', 'missed'] 

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Adherence Tracking</Typography>
          <Typography variant="body2" color="text.secondary">Color-coded completion overview</Typography>
        </Box>
        <ToggleButtonGroup value={period} exclusive onChange={(_, v) => v && setPeriod(v)} size="small">
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="quarter">Quarter</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon
          const count = data.filter(d => d.status === key).length
          return (
            <Paper key={key} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Icon size={24} className={`text-${cfg.color}.main`} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>{count}</Typography>
                  <Typography variant="caption" color="text.secondary">{cfg.label}</Typography>
                </Box>
              </Stack>
            </Paper>
          )
        })}
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary' }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary' }} align="center">Rate</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary' }} align="center">Status</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary' }} align="center">Completed</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary' }} align="center">Streak</TableCell>
              {period === 'week' && weekDays.map(day => (
                <TableCell key={day} sx={{ fontWeight: 600, fontSize: 10, color: 'text.secondary', px: 0.5, display: { xs: 'none', sm: 'table-cell' } }} align="center">{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.partial
              const Icon = cfg.icon
              return (
                <TableRow key={row.clientId} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'grey.200', color: 'grey.700' }}>
                        {row.clientName.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>{row.clientName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600} color={row.rate >= 80 ? 'success.main' : row.rate >= 60 ? 'warning.main' : 'error.main'}>
                      {row.rate}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<Icon size={14} />}
                      label={cfg.label}
                      size="small"
                      color={cfg.color}
                      variant="outlined"
                      sx={{ fontSize: 11, fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{row.completed}/{row.total}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                      <TrendingUp size={14} className={row.streak > 0 ? 'text-green-500' : 'text-gray-300'} />
                      <Typography variant="body2" fontWeight={500}>{row.streak}</Typography>
                    </Stack>
                  </TableCell>
                  {period === 'week' && weekDays.map(day => {
                    const dayStatus = statuses[Math.floor(Math.random() * statuses.length)]
                    const dayCfg = STATUS_CONFIG[dayStatus]
                    return (
                      <TableCell key={day} align="center" sx={{ px: 0.5, display: { xs: 'none', sm: 'table-cell' } }}>
                        <Tooltip title={`${row.clientName} - ${day}: ${dayCfg.label}`}>
                          <Box sx={{ width: 20, height: 20, borderRadius: 0.5, bgcolor: `${dayCfg.color}.main`, opacity: 0.8, mx: 'auto', cursor: 'pointer' }} />
                        </Tooltip>
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
