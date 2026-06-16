import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Paper, Typography, TextField, Button, Alert, Stack, Link, RadioGroup, Radio, FormControlLabel, FormControl, FormLabel
} from '@mui/material'
import { Dumbbell, Mail, Lock, User, UserPlus, Zap } from 'lucide-react'
import { useAuth } from '../stores/authStore'

export default function SignUp() {
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signUp({ name, email, password, role })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(15,15,26,0.9) 0%, rgba(26,26,46,0.75) 50%, rgba(15,15,26,0.9) 100%)',
        zIndex: 0,
      },
    }}>
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Box sx={{
        flex: { xs: 1, md: '0 0 460px' }, display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 2, md: 6 }, position: 'relative', zIndex: 1,
      }}>
        <Paper elevation={0} sx={{
          p: { xs: 3, sm: 4 }, maxWidth: 420, width: '100%', borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
              <Dumbbell size={24} color="white" />
            </Box>
            <Typography variant="h5" fontWeight={800}>Ever Fitness</Typography>
          </Box>

          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={800} color="text.primary">Create account</Typography>
            <Typography variant="body2" color="text.secondary">Start your fitness journey today</Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2, py: 0.5 }}>{error}</Alert>
              )}
              <TextField
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
                fullWidth
                size="small"
                slotProps={{ input: { startAdornment: <User size={18} className="text-gray-400 mr-2" /> } }}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                fullWidth
                size="small"
                slotProps={{ input: { startAdornment: <Mail size={18} className="text-gray-400 mr-2" /> } }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                fullWidth
                size="small"
                slotProps={{ input: { startAdornment: <Lock size={18} className="text-gray-400 mr-2" /> } }}
              />

              <FormControl>
                <FormLabel sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>I am a</FormLabel>
                <RadioGroup row value={role} onChange={e => setRole(e.target.value)}>
                  <FormControlLabel value="client" control={<Radio size="small" />} label="Client" />
                  <FormControlLabel value="coach" control={<Radio size="small" />} label="Coach" />
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                fullWidth
                size="large"
                startIcon={<UserPlus size={18} />}
                sx={{ py: 1.3 }}
              >
                {submitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" fontWeight={700} color="primary.main" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Box>

      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
        justifyContent: 'center', p: 8, position: 'relative', zIndex: 1,
        backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        '&::before': {
          content: '""', position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(15,15,26,0.85) 0%, rgba(26,26,46,0.7) 50%, rgba(15,15,26,0.85) 100%)',
          zIndex: 0,
        },
      }}>
        <Box sx={{ maxWidth: 480, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: 2.5, background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
            <Dumbbell size={32} color="white" />
          </Box>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2, mb: 1.5 }}>
            Start Your Journey
          </Typography>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2, mb: 3 }}>
            Today
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.125rem', maxWidth: 400, lineHeight: 1.7 }}>
            Join thousands of members who have transformed their lives with personalized coaching and data-driven workouts.
          </Typography>
          <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
            {['Smart Workouts', 'Track Progress', 'Expert Support'].map(label => (
              <Stack key={label} direction="row" spacing={1} alignItems="center">
                <Zap size={14} color="#10b981" />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
