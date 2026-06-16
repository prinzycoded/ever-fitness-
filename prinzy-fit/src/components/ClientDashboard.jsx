import { Box, Typography, Paper, Stack, Grid } from '@mui/material'
import { Crosshair, CreditCard, CheckCircle, Calendar, TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react'
import { useAuth } from '../stores/authStore'
import { useApp } from '../stores/appStore'
import { useNavigate } from 'react-router-dom'

const STAT_GRADIENTS = {
  'Goal': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
  'Membership': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  'Workouts Done': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'Upcoming': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: 2.5, border: '1px solid', borderColor: 'divider',
      transition: 'all 0.2s', cursor: 'default',
      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderColor: 'primary.light' },
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mt: 0.25 }}>{value}</Typography>
        </Box>
        <Box sx={{
          width: 40, height: 40, borderRadius: 1.5, ml: 1.5,
          background: STAT_GRADIENTS[label] || 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(168,85,247,0.2)',
        }}>
          <Icon size={18} color="white" />
        </Box>
      </Stack>
    </Paper>
  )
}

export default function ClientDashboard() {
  const { profile } = useAuth()
  const { workouts, progress, coach } = useApp()
  const navigate = useNavigate()

  const myWorkouts = workouts.filter(w => w.clientId === profile?.id || w.clientId === profile?.email)
  const myProgress = progress.filter(p => p.clientId === profile?.id || p.clientId === profile?.email)

  const completedWorkouts = myWorkouts.filter(w => w.status === 'completed').length
  const latestProgress = myProgress[myProgress.length - 1]
  const firstProgress = myProgress[0]
  const weightChange = latestProgress && firstProgress && latestProgress.id !== firstProgress.id
    ? (latestProgress.weight - firstProgress.weight).toFixed(1)
    : null

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Welcome back, {profile.name}!</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>Here's your fitness overview.</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Goal" value={profile.goal || 'Not set'} icon={Crosshair} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Membership" value={profile.membership || 'Active'} icon={CreditCard} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Workouts Done" value={completedWorkouts} icon={CheckCircle} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard label="Upcoming" value={myWorkouts.filter(w => w.status === 'scheduled').length} icon={Calendar} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Weight Progress</Typography>
            {myProgress.length > 0 ? (
              <>
                {weightChange !== null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    {Number(weightChange) < 0 ? <TrendingDown size={18} className="text-green-600" /> : Number(weightChange) > 0 ? <TrendingUp size={18} className="text-red-600" /> : <Minus size={18} className="text-gray-600" />}
                    <Typography variant="body2" fontWeight={600} sx={{ color: Number(weightChange) < 0 ? 'success.main' : Number(weightChange) > 0 ? 'error.main' : 'text.secondary' }}>
                      {Number(weightChange) < 0 ? 'Lost' : Number(weightChange) > 0 ? 'Gained' : 'No change'} {Math.abs(weightChange)} kg since start
                    </Typography>
                  </Box>
                )}
                <Stack spacing={0.5}>
                  {[...myProgress].reverse().slice(0, 5).map(p => (
                    <Stack key={p.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                      <Typography variant="body2" color="text.secondary">{p.date}</Typography>
                      <Typography variant="body2" fontWeight={600}>{p.weight} kg</Typography>
                    </Stack>
                  ))}
                </Stack>
              </>
            ) : (
              <Typography variant="body2" color="text.disabled">No progress entries yet.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            onClick={() => navigate('/my-coach')}
            sx={{
              p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider',
              cursor: 'pointer', transition: 'all 0.2s',
              '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderColor: 'primary.light' },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Your Coach</Typography>
              <ArrowRight size={18} className="text-gray-400" />
            </Stack>
            {coach && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'indigo.100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'indigo.700' }}>
                    {coach.name?.split(' ').map(n => n[0]).join('')}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{coach.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{coach.specialization}</Typography>
                  </Box>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">{coach.email}</Typography>
                  {coach.phone && <Typography variant="body2" color="text.secondary">{coach.phone}</Typography>}
                </Stack>
                <Typography variant="caption" color="text.disabled">Reach out to your coach for guidance and support.</Typography>
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}