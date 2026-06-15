import { useState, useCallback } from 'react'
import { Box, Typography, Paper, Button, Stack, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, IconButton, MenuItem } from '@mui/material'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { defaultPrograms as fallbackPrograms } from '../data/seedData'

function ProgramForm({ open, onClose, edit }) {
  const { addProgram, updateProgram } = useApp()
  const [form, setForm] = useState(edit || { name: '', description: '', duration: 4, durationUnit: 'weeks', price: 0, sessionsPerWeek: 3, active: true })

  const handleSubmit = useCallback(() => {
    if (!form.name.trim()) return
    if (edit) {
      updateProgram(edit.id, form)
    } else {
      addProgram(form)
    }
    onClose()
  }, [form, edit, addProgram, updateProgram, onClose])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>{edit ? 'Edit Program' : 'New Program'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Program Name" size="small" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth required />
          <TextField label="Description" size="small" multiline rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField type="number" label="Duration" size="small" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select label="Unit" size="small" value={form.durationUnit} onChange={e => setForm({ ...form, durationUnit: e.target.value })} fullWidth>
                {['weeks', 'months'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField type="number" label="Sessions/Week" size="small" value={form.sessionsPerWeek} onChange={e => setForm({ ...form, sessionsPerWeek: Number(e.target.value) })} fullWidth />
            </Grid>
          </Grid>
          <TextField type="number" label="Price ($)" size="small" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} fullWidth slotProps={{ input: { startAdornment: <Typography variant="body2" sx={{ mr: 0.5, color: 'text.secondary' }}>$</Typography> } }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{edit ? 'Save Changes' : 'Create Program'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default function BookingPrograms() {
  const { programs, addProgram, updateProgram, deleteProgram } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const allPrograms = programs.length > 0 ? programs : fallbackPrograms

  const handleToggle = (prog) => {
    if (prog.id) {
      updateProgram(prog.id, { active: !prog.active })
    } else {
      addProgram({ ...prog, active: !prog.active })
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Booking Programs</Typography>
          <Typography variant="body2" color="text.secondary">Define what each booking includes</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setEditing(null); setShowForm(true) }} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
          Add Program
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {allPrograms.map((prog, i) => (
          <Grid item xs={12} sm={6} lg={4} key={prog.id || i}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', opacity: prog.active ? 1 : 0.5, position: 'relative' }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'indigo.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={20} className="text-indigo-600" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{prog.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{prog.duration} {prog.durationUnit} · {prog.sessionsPerWeek}x/week</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => { setEditing(prog); setShowForm(true) }}><Pencil size={14} /></IconButton>
                  {prog.id && <IconButton size="small" onClick={() => deleteProgram(prog.id)} color="error"><Trash2 size={14} /></IconButton>}
                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>{prog.description}</Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight={700} color="indigo.600">${prog.price}</Typography>
                <Chip label={prog.active ? 'Active' : 'Inactive'} size="small" color={prog.active ? 'success' : 'default'} onClick={() => handleToggle(prog)} sx={{ cursor: 'pointer' }} />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <ProgramForm open={showForm} onClose={() => setShowForm(false)} edit={editing} />
    </Box>
  )
}
