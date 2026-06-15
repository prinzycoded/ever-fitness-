import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Paper, Typography, TextField, Button, Alert, Stack, Link, RadioGroup, Radio, FormControlLabel, FormControl, FormLabel
} from '@mui/material'
import { Dumbbell, Mail, Lock, User, LogIn } from 'lucide-react'
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
              Create your account
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
              label="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              required
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: <User size={18} className="text-gray-400 mr-2" />,
                },
              }}
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
              placeholder="At least 6 characters"
              required
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: <Lock size={18} className="text-gray-400 mr-2" />,
                },
              }}
            />

            <FormControl>
              <FormLabel sx={{ fontSize: '0.875rem', color: 'grey.700', mb: 0.5 }}>I am a</FormLabel>
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
              size="medium"
              startIcon={<LogIn size={18} />}
              sx={{ textTransform: 'none', fontWeight: 600, py: 1.2, borderRadius: 2, bgcolor: 'indigo.600', '&:hover': { bgcolor: 'indigo.700' } }}
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="grey.500" align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" fontWeight={600} color="indigo.600" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
