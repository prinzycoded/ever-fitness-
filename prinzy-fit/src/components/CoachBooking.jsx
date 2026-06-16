import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, Button, Stack, Grid, Chip, Avatar, Card, CardContent } from '@mui/material'
import { Calendar, Clock, DollarSign, Dumbbell, CheckCircle, ArrowRight } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { useAuth } from '../stores/authStore'
import { defaultPrograms as fallbackPrograms, defaultWorkingHours as fallbackHours } from '../data/seedData'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function CoachBooking() {
  const navigate = useNavigate()
  const { programs, workingHours, coach } = useApp()
  useAuth()
  const [selectedProgram, setSelectedProgram] = useState(null)

  const displayPrograms = programs.length > 0 ? programs.filter(p => p.active) : fallbackPrograms
  const hours = workingHours.length > 0 ? workingHours : fallbackHours

  const grouped = DAYS.map(day => ({
    day,
    slots: hours.filter(s => s.day === day),
  })).filter(g => g.slots.length > 0)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={4}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Avatar src={coach?.avatar} sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'indigo.100' }}>
            <Dumbbell size={36} className="text-indigo-600" />
          </Avatar>
          <Typography variant="h4" fontWeight={700}>Train with {coach?.name || 'Your Coach'}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600, mx: 'auto' }}>
            {coach?.specialization || 'Expert personal training tailored to your goals'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <DollarSign size={20} />
              <span>Programs & Pricing</span>
            </Stack>
          </Typography>
          <Grid container spacing={2}>
            {displayPrograms.map((prog, i) => (
              <Grid item xs={12} sm={6} md={4} key={prog.id || i}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: selectedProgram?.name === prog.name ? 'indigo.500' : 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'indigo.300', transform: 'translateY(-2px)' },
                  }}
                  onClick={() => setSelectedProgram(prog)}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Chip label={`${prog.duration} ${prog.durationUnit}`} size="small" color="indigo" variant="outlined" />
                        {selectedProgram?.name === prog.name && <CheckCircle size={18} className="text-indigo-600" />}
                      </Stack>
                      <Typography variant="h6" fontWeight={700}>${prog.price}</Typography>
                      <Typography variant="subtitle2" fontWeight={600}>{prog.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{prog.description}</Typography>
                      <Typography variant="caption" color="text.secondary">{prog.sessionsPerWeek} sessions/week</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Calendar size={20} />
              <span>Available Time Slots</span>
            </Stack>
          </Typography>
          <Grid container spacing={1.5}>
            {grouped.map(({ day, slots }) => (
              <Grid item xs={12} sm={6} md={4} key={day}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{day}</Typography>
                  {slots.map((s, i) => (
                    <Stack key={i} direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      <Clock size={14} />
                      <Typography variant="caption">{s.start} - {s.end}</Typography>
                    </Stack>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center', pb: 4 }}>
          <Button
            variant="contained"
            size="large"
            disabled={!selectedProgram}
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/checkout', { state: { program: selectedProgram } })}
            sx={{ textTransform: 'none', fontWeight: 600, px: 4, py: 1.5, borderRadius: 2, fontSize: 16 }}
          >
            {selectedProgram ? `Book ${selectedProgram.name}` : 'Select a Program to Continue'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
