import { useState, useRef } from 'react'
import { Box, Typography, Paper, Button, Stack, Grid, TextField, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, MenuItem } from '@mui/material'
import { Search, Plus, Dumbbell, Image, X, Upload } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { defaultExercises as fallbackExercises } from '../data/seedData'

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body']
const equipment = ['All', 'barbell', 'dumbbell', 'bodyweight', 'cable', 'machine', 'kettlebell', 'resistance band']

function ExerciseCard({ exercise, onSelect, selected }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2, borderRadius: 2, border: '2px solid',
        borderColor: selected ? 'indigo.500' : 'divider',
        cursor: 'pointer', transition: 'all 0.2s',
        '&:hover': { borderColor: 'indigo.300', transform: 'translateY(-1px)' },
      }}
      onClick={() => onSelect(exercise)}
    >
      <Stack spacing={1.5}>
        <Box sx={{ height: 120, borderRadius: 1.5, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {exercise.imageUrl ? (
            <Box component="img" src={exercise.imageUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Dumbbell size={36} className="text-gray-300" />
          )}
        </Box>
        <Typography variant="subtitle2" fontWeight={600}>{exercise.name}</Typography>
        <Typography variant="caption" color="text.secondary">{exercise.description}</Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          <Chip label={exercise.category} size="small" variant="outlined" sx={{ fontSize: 10 }} />
          <Chip label={exercise.equipment} size="small" variant="outlined" sx={{ fontSize: 10 }} />
        </Stack>
      </Stack>
    </Paper>
  )
}

export default function ExerciseRepository({ onSelectExercise }) {
  const { exercises, addExercise } = useApp()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'chest', equipment: 'barbell', targetMuscles: '', description: '' })
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const allExercises = exercises.length > 0 ? exercises : fallbackExercises

  const filtered = allExercises.filter(ex => {
    const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase()) || ex.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || ex.category === categoryFilter.toLowerCase()
    return matchSearch && matchCat
  })

  const handleSelect = (exercise) => {
    setSelected(exercise)
    if (onSelectExercise) onSelectExercise(exercise)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveExercise = async () => {
    if (!form.name.trim()) return
    const targetMusclesArray = form.targetMuscles.split(',').map(m => m.trim()).filter(Boolean)
    const exercise = {
      name: form.name.trim(),
      category: form.category,
      equipment: form.equipment,
      targetMuscles: targetMusclesArray,
      description: form.description.trim(),
      imageUrl: imagePreview,
    }
    await addExercise(exercise)
    setShowForm(false)
    setImagePreview(null)
    setForm({ name: '', category: 'chest', equipment: 'barbell', targetMuscles: '', description: '' })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <TextField
          size="small"
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>,
            }
          }}
        />
        <Button size="small" variant="outlined" startIcon={<Plus size={14} />} onClick={() => { setForm({ name: '', category: 'chest', equipment: 'barbell', targetMuscles: '', description: '' }); setImagePreview(null); setShowForm(true) }} sx={{ textTransform: 'none', fontSize: 12 }}>
          New
        </Button>
      </Stack>

      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
        {categories.map(cat => (
          <Chip key={cat} label={cat} size="small" variant={categoryFilter === cat ? 'filled' : 'outlined'} onClick={() => setCategoryFilter(cat)} color={categoryFilter === cat ? 'indigo' : 'default'} />
        ))}
      </Stack>

      <Grid container spacing={1.5} sx={{ maxHeight: 400, overflow: 'auto' }}>
        {filtered.map(ex => (
          <Grid item xs={6} sm={4} md={3} key={ex.id}>
            <ExerciseCard exercise={ex} onSelect={handleSelect} selected={selected?.id === ex.id} />
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 4 }}>No exercises found.</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Add Exercise</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Exercise Name" size="small" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth required />
            <TextField select label="Category" size="small" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} fullWidth>
              {categories.filter(c => c !== 'All').map(c => <MenuItem key={c} value={c.toLowerCase()}>{c}</MenuItem>)}
            </TextField>
            <TextField select label="Equipment" size="small" value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} fullWidth>
              {equipment.filter(e => e !== 'All').map(e => <MenuItem key={e} value={e.toLowerCase()}>{e}</MenuItem>)}
            </TextField>
            <TextField label="Target Muscles (comma-separated)" size="small" value={form.targetMuscles} onChange={e => setForm({ ...form, targetMuscles: e.target.value })} fullWidth placeholder="e.g., Chest, Triceps, Shoulders" />
            <TextField label="Description / Instructions" size="small" multiline rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 80, height: 80, borderRadius: 1.5, border: '2px dashed', borderColor: 'divider',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  bgcolor: 'grey.50', overflow: 'hidden', flexShrink: 0,
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {!imagePreview && <Image size={24} className="text-gray-300" />}
              </Box>
              <Button variant="outlined" component="label" startIcon={<Upload size={16} />} sx={{ textTransform: 'none' }}>
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileSelect} />
              </Button>
              {imagePreview && (
                <IconButton size="small" onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}>
                  <X size={16} />
                </IconButton>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowForm(false); setImagePreview(null) }} color="inherit">Cancel</Button>
          <Button variant="contained" disabled={!form.name.trim()} onClick={handleSaveExercise}>Save Exercise</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
