import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Typography, Paper, Button, Stack, Grid, TextField, MenuItem, Stepper, Step, StepLabel, Alert, Avatar, Divider } from '@mui/material'
import { CreditCard, CheckCircle, ArrowLeft, Dumbbell } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { useAuth } from '../stores/authStore'

const STEPS = ['Review Plan', 'Personal Info', 'Payment', 'Confirmation']

const goals = [
  'Weight Loss', 'Muscle Building', 'General Fitness', 'Strength Training',
  'Endurance', 'Flexibility', 'Rehabilitation', 'Sports Performance',
]

const experienceLevels = [
  'Beginner', 'Intermediate', 'Advanced',
]

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addBooking, addPayment, addWorkout, addNotification } = useApp()
  const { profile, user } = useAuth()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const program = location.state?.program

  const [form, setForm] = useState({
    fullName: profile?.name || '',
    email: user?.email || '',
    phone: '',
    goal: '',
    experienceLevel: '',
    medicalConditions: '',
    notes: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setError('')
    try {
      const booking = await addBooking({
        clientId: profile?.id || user?.email,
        clientName: form.fullName,
        programName: program.name,
        programPrice: program.price,
        email: form.email,
        phone: form.phone,
        goal: form.goal,
        experienceLevel: form.experienceLevel,
        medicalConditions: form.medicalConditions,
        notes: form.notes,
      })
      await addPayment({
        bookingId: booking.id,
        clientId: profile?.id || user?.email,
        clientName: form.fullName,
        amount: program.price,
        status: 'completed',
        method: 'card',
      })
      await addWorkout({
        clientId: profile?.id || user?.email,
        name: program.name,
        scheduledDate: new Date().toISOString().slice(0, 10),
        status: 'scheduled',
        exercises: [],
      })
      await addNotification({
        message: `${form.fullName} booked "${program.name}" and paid $${program.price}`,
        type: 'booking',
      })
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }, [form, program, profile, user, addBooking, addPayment, addNotification])

  if (!program) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">No program selected.</Typography>
        <Button onClick={() => navigate('/coach-booking')} sx={{ mt: 2, textTransform: 'none' }}>Browse Programs</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/coach-booking')} sx={{ textTransform: 'none', mb: 2, color: 'text.secondary' }}>
        Back to Programs
      </Button>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {step === 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: 'indigo.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell size={24} className="text-indigo-600" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>{program.name}</Typography>
                <Typography variant="body2" color="text.secondary">{program.description}</Typography>
              </Box>
            </Stack>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={4}><Typography variant="caption" color="text.secondary">Duration</Typography><Typography variant="body2" fontWeight={600}>{program.duration} {program.durationUnit}</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption" color="text.secondary">Sessions/Week</Typography><Typography variant="body2" fontWeight={600}>{program.sessionsPerWeek}</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption" color="text.secondary">Total Sessions</Typography><Typography variant="body2" fontWeight={600}>{program.duration * program.sessionsPerWeek}</Typography></Grid>
            </Grid>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Total</Typography>
              <Typography variant="h5" fontWeight={700} color="indigo.600">${program.price}</Typography>
            </Stack>
            <Button variant="contained" onClick={() => setStep(1)} fullWidth sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.2 }}>
              Continue to Personal Info
            </Button>
          </Stack>
        </Paper>
      )}

      {step === 1 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Personal Information</Typography>
          <Stack spacing={2}>
            <TextField label="Full Name" size="small" value={form.fullName} onChange={e => update('fullName', e.target.value)} fullWidth required />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Email" size="small" type="email" value={form.email} onChange={e => update('email', e.target.value)} fullWidth required />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Phone" size="small" value={form.phone} onChange={e => update('phone', e.target.value)} fullWidth />
              </Grid>
            </Grid>
            <TextField select label="Primary Goal" size="small" value={form.goal} onChange={e => update('goal', e.target.value)} fullWidth>
              {goals.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </TextField>
            <TextField select label="Experience Level" size="small" value={form.experienceLevel} onChange={e => update('experienceLevel', e.target.value)} fullWidth>
              {experienceLevels.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <TextField label="Medical Conditions / Injuries" size="small" multiline rows={2} value={form.medicalConditions} onChange={e => update('medicalConditions', e.target.value)} fullWidth />
            <TextField label="Additional Notes" size="small" multiline rows={2} value={form.notes} onChange={e => update('notes', e.target.value)} fullWidth />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setStep(0)} color="inherit" sx={{ textTransform: 'none' }}>Back</Button>
              <Button variant="contained" onClick={() => setStep(2)} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                Continue to Payment
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {step === 2 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CreditCard size={20} />
              <span>Payment Details</span>
            </Stack>
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Stack spacing={2}>
            <TextField label="Cardholder Name" size="small" value={form.cardName} onChange={e => update('cardName', e.target.value)} fullWidth required />
            <TextField label="Card Number" size="small" value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)} fullWidth required placeholder="4242 4242 4242 4242" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Expiry Date" size="small" value={form.expiry} onChange={e => update('expiry', e.target.value)} fullWidth required placeholder="MM/YY" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="CVV" size="small" value={form.cvv} onChange={e => update('cvv', e.target.value)} fullWidth required placeholder="123" />
              </Grid>
            </Grid>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Total Amount</Typography>
              <Typography variant="h6" fontWeight={700} color="indigo.600">${program.price}</Typography>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setStep(1)} color="inherit" sx={{ textTransform: 'none' }}>Back</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={submitting} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.2 }}>
                {submitting ? 'Processing...' : `Pay $${program.price}`}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {step === 3 && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <CheckCircle size={64} className="text-green-500" style={{ margin: '0 auto 16px' }} />
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Booking Confirmed!</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Welcome to {program.name}! Check your email for onboarding details.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Go to Dashboard
          </Button>
        </Paper>
      )}
    </Box>
  )
}
