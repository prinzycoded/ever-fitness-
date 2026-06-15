import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Paper, Typography, TextField, Button, Alert, Stack, Link
} from '@mui/material'
import { Dumbbell, Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../stores/authStore'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: 400, width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'indigo.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={28} className="text-indigo-600" />
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight={700} color="grey.900">
              Ever Fitness
            </Typography>
            <Typography variant="body2" color="grey.500" sx={{ mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2, py: 0.5 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: <Mail size={18} className="text-gray-400 mr-2" />,
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: <Lock size={18} className="text-gray-400 mr-2" />,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              fullWidth
              size="medium"
              startIcon={<LogIn size={18} />}
              sx={{ textTransform: 'none', fontWeight: 600, py: 1.2, borderRadius: 2, bgcolor: 'indigo.600', '&:hover': { bgcolor: 'indigo.700' } }}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="grey.500" align="center" sx={{ mt: 3 }}>
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/signup" fontWeight={600} color="indigo.600" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
