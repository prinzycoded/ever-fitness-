import { useState, useCallback } from 'react'
import { Box, Typography, Paper, Button, Stack, Grid, IconButton, TextField, MenuItem, Alert } from '@mui/material'
import { Plus, Trash2, Calendar, Clock } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { defaultWorkingHours as fallbackHours } from '../data/seedData'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function TimeSlot({ slot, index, onChange, onRemove }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
      <TextField select size="small" value={slot.day} onChange={e => onChange(index, 'day', e.target.value)} sx={{ width: { xs: '100%', sm: 140 } }}>
        {DAYS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
      </TextField>
      <TextField type="time" size="small" value={slot.start} onChange={e => onChange(index, 'start', e.target.value)} sx={{ width: { xs: '100%', sm: 120 } }} slotProps={{ inputLabel: { shrink: true } }} />
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>to</Typography>
      <TextField type="time" size="small" value={slot.end} onChange={e => onChange(index, 'end', e.target.value)} sx={{ width: { xs: '100%', sm: 120 } }} slotProps={{ inputLabel: { shrink: true } }} />
      <IconButton size="small" onClick={() => onRemove(index)} color="error" sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}><Trash2 size={16} /></IconButton>
    </Stack>
  )
}

export default function CalendarSettings() {
  const { workingHours, saveWorkingHours } = useApp()
  const [slots, setSlots] = useState(workingHours.length > 0 ? workingHours : fallbackHours)
  const [saved, setSaved] = useState(false)

  const updateSlot = useCallback((index, field, value) => {
    setSlots(slots.map((s, i) => i === index ? { ...s, [field]: value } : s))
    setSaved(false)
  }, [slots])

  const addSlot = useCallback(() => {
    setSlots([...slots, { day: 'Monday', start: '09:00', end: '10:00' }])
    setSaved(false)
  }, [slots])

  const removeSlot = useCallback((index) => {
    setSlots(slots.filter((_, i) => i !== index))
    setSaved(false)
  }, [slots])

  const handleSave = useCallback(async () => {
    await saveWorkingHours(slots)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [slots, saveWorkingHours])

  const grouped = DAYS.map(day => ({
    day,
    slots: slots.filter(s => s.day === day),
  }))

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Working Hours</Typography>
          <Typography variant="body2" color="text.secondary">Set your available time slots using Google Calendar sync</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {saved && <Alert severity="success" sx={{ py: 0, px: 1.5, borderRadius: 2 }}>Saved!</Alert>}
          <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>Save Hours</Button>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Calendar size={18} />
            <Typography variant="subtitle2" fontWeight={600}>Weekly Schedule</Typography>
          </Stack>
          <Button size="small" startIcon={<Plus size={14} />} onClick={addSlot} sx={{ textTransform: 'none' }}>Add Time Slot</Button>
        </Stack>
        <Stack spacing={1.5}>
          {slots.map((slot, i) => (
            <TimeSlot key={i} slot={slot} index={i} onChange={updateSlot} onRemove={removeSlot} />
          ))}
          {slots.length === 0 && (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">No time slots set. Click "Add Time Slot" to begin.</Typography>
          )}
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {grouped.map(({ day, slots: daySlots }) => (
          <Grid item xs={12} sm={6} md={4} key={day}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{day}</Typography>
              {daySlots.length > 0 ? daySlots.map((s, i) => (
                <Stack key={i} direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  <Clock size={14} />
                  <Typography variant="caption">{s.start} - {s.end}</Typography>
                </Stack>
              )) : (
                <Typography variant="caption" color="text.disabled" fontStyle="italic">Not available</Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
