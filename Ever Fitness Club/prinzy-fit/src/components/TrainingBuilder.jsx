import { useState, useCallback } from 'react'
import { Box, Typography, Paper, Button, Stack, Grid, TextField, Chip, IconButton, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material'
import { Plus, GripVertical, Trash2, Save, CalendarDays, ChevronDown, ChevronRight, Dumbbell, Copy } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { defaultTrainingPlan as fallbackPlan } from '../data/seedData'
import ExerciseRepository from './ExerciseRepository'

function DayWorkout({ day, index, weekIndex, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true)
  const toggleExpanded = () => setExpanded(e => !e)

  return (
    <Paper elevation={0} sx={{ borderRadius: 1.5, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Stack
        direction="row" alignItems="center" justifyContent="space-between"
        sx={{ p: 1.5, bgcolor: 'grey.50', cursor: 'pointer' }}
        onClick={toggleExpanded}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <GripVertical size={16} className="text-gray-300" />
          <Typography variant="subtitle2" fontWeight={600}>Day {day.dayNumber}</Typography>
          <Chip label={day.focus || 'Rest'} size="small" variant="outlined" sx={{ fontSize: 10 }} />
          {day.exercises?.length > 0 && (
            <Chip label={`${day.exercises.length} exercises`} size="small" sx={{ fontSize: 10 }} />
          )}
        </Stack>
        <Stack direction="row" spacing={0.5}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(weekIndex, index) }} color="error"><Trash2 size={14} /></IconButton>
        </Stack>
      </Stack>
      {expanded && (
        <Box sx={{ p: 1.5 }}>
          <Stack spacing={1.5}>
            <TextField
              select size="small" label="Focus" value={day.focus || ''}
              onChange={e => onUpdate(weekIndex, index, 'focus', e.target.value)}
              fullWidth
            >
              {['Rest', 'Upper Body', 'Lower Body', 'Push', 'Pull', 'Full Body', 'Cardio', 'Active Recovery'].map(f => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </TextField>

            {day.exercises?.map((ex, ei) => (
              <Paper key={ei} elevation={0} sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Dumbbell size={14} />
                    <Typography variant="body2" fontWeight={500}>{ex.name}</Typography>
                  </Stack>
                  <IconButton size="small" onClick={() => {
                    const updatedExercises = day.exercises.filter((_, i) => i !== ei)
                    onUpdate(weekIndex, index, 'exercises', updatedExercises)
                  }} color="error"><Trash2 size={14} /></IconButton>
                </Stack>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <TextField type="number" size="small" label="Sets" value={ex.sets || ''} onChange={e => {
                      const updated = [...day.exercises]; updated[ei] = { ...updated[ei], sets: Number(e.target.value) }
                      onUpdate(weekIndex, index, 'exercises', updated)
                    }} fullWidth slotProps={{ htmlInput: { style: { textAlign: 'center' } } }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField type="number" size="small" label="Reps" value={ex.reps || ''} onChange={e => {
                      const updated = [...day.exercises]; updated[ei] = { ...updated[ei], reps: Number(e.target.value) }
                      onUpdate(weekIndex, index, 'exercises', updated)
                    }} fullWidth slotProps={{ htmlInput: { style: { textAlign: 'center' } } }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField type="number" size="small" label="Weight" value={ex.weight || ''} onChange={e => {
                      const updated = [...day.exercises]; updated[ei] = { ...updated[ei], weight: Number(e.target.value) }
                      onUpdate(weekIndex, index, 'exercises', updated)
                    }} fullWidth slotProps={{ htmlInput: { style: { textAlign: 'center' } } }} />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button
              size="small" variant="outlined" startIcon={<Plus size={14} />}
              onClick={() => {
                const repo = document.getElementById('exercise-repo-dialog')
                if (repo) repo.style.display = 'block'
              }}
              sx={{ textTransform: 'none', fontSize: 12 }}
            >
              Add Exercise
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  )
}

function WeekBlock({ week, index, onUpdate, onRemove, onAddDay }) {
  const [expanded] = useState(true)

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '2px solid', borderColor: 'indigo.200', bgcolor: 'indigo.50' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CalendarDays size={20} className="text-indigo-600" />
          <Typography variant="subtitle1" fontWeight={700} color="indigo.900">{week.name || `Week ${week.weekNumber}`}</Typography>
          <Chip label={`${week.days?.length || 0} days`} size="small" sx={{ fontSize: 10 }} />
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Duplicate week"><IconButton size="small" onClick={() => onUpdate(index, 'duplicate')}><Copy size={16} /></IconButton></Tooltip>
          <IconButton size="small" onClick={() => onRemove(index)} color="error"><Trash2 size={16} /></IconButton>
        </Stack>
      </Stack>

      {expanded && (
        <Stack spacing={1}>
          {week.days?.map((day, di) => (
            <DayWorkout key={di} day={day} index={di} weekIndex={index} onUpdate={onUpdate} onRemove={onRemove} />
          ))}
          <Button size="small" startIcon={<Plus size={14} />} onClick={() => onAddDay(index)} sx={{ textTransform: 'none', fontSize: 12, alignSelf: 'flex-start' }}>
            Add Day
          </Button>
        </Stack>
      )}
    </Paper>
  )
}

export default function TrainingBuilder() {
  const { trainingPlans, saveTrainingPlan } = useApp()
  const [plans] = useState(() => trainingPlans.length > 0 ? trainingPlans : [{ ...fallbackPlan, id: `plan_${Date.now()}` }])
  const [selectedPlan, setSelectedPlan] = useState(plans[0])
  const [showRepo, setShowRepo] = useState(false)
  const [activeDay] = useState(null)

  const updateWeek = useCallback((weekIndex, action) => {
    const updated = { ...selectedPlan }
    if (action === 'remove') {
      updated.weeks = updated.weeks.filter((_, i) => i !== weekIndex)
    } else if (action === 'duplicate') {
      const dup = JSON.parse(JSON.stringify(updated.weeks[weekIndex]))
      dup.weekNumber = updated.weeks.length + 1
      updated.weeks = [...updated.weeks, dup]
    } else if (action === 'addDay') {
      const dayNum = (updated.weeks[weekIndex].days?.length || 0) + 1
      updated.weeks[weekIndex].days = [...(updated.weeks[weekIndex].days || []), { dayNumber: dayNum, focus: 'Rest', exercises: [] }]
    }
    setSelectedPlan(updated)
  }, [selectedPlan])

  const addWeek = useCallback(() => {
    const wn = (selectedPlan.weeks?.length || 0) + 1
    setSelectedPlan({
      ...selectedPlan,
      weeks: [...(selectedPlan.weeks || []), { weekNumber: wn, name: `Week ${wn}`, days: [{ dayNumber: 1, focus: 'Rest', exercises: [] }] }],
    })
  }, [selectedPlan])

  const handleSave = useCallback(async () => {
    await saveTrainingPlan(selectedPlan)
  }, [selectedPlan, saveTrainingPlan])

  const handleSelectExercise = useCallback((exercise) => {
    if (activeDay !== null) {
      const updated = { ...selectedPlan }
      for (const w of updated.weeks) {
        for (const d of (w.days || [])) {
          if (d.dayNumber === activeDay) {
            d.exercises = [...(d.exercises || []), { name: exercise.name, sets: 3, reps: 10, weight: 0, exerciseId: exercise.id }]
          }
        }
      }
      setSelectedPlan(updated)
      setShowRepo(false)
    }
  }, [selectedPlan, activeDay])

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Training Builder</Typography>
          <Typography variant="body2" color="text.secondary">Drag-and-drop workout planning</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <TextField select size="small" value={selectedPlan?.id || ''} onChange={e => setSelectedPlan(plans.find(p => p.id === e.target.value))} sx={{ minWidth: 200 }}>
            {plans.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </TextField>
          <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Save Plan
          </Button>
        </Stack>
      </Stack>

      {selectedPlan && (
        <Stack spacing={2}>
          <TextField label="Plan Name" size="small" value={selectedPlan.name} onChange={e => setSelectedPlan({ ...selectedPlan, name: e.target.value })} sx={{ maxWidth: 400 }} />

          <Grid container spacing={2}>
            {selectedPlan.weeks?.map((week, wi) => (
              <Grid item xs={12} key={wi}>
                <WeekBlock week={week} index={wi} onUpdate={updateWeek} onRemove={(i) => updateWeek(i, 'remove')} onAddDay={(i) => updateWeek(i, 'addDay')} />
              </Grid>
            ))}
          </Grid>

          <Button variant="outlined" startIcon={<Plus size={16} />} onClick={addWeek} sx={{ textTransform: 'none', borderRadius: 2, alignSelf: 'flex-start' }}>
            Add Week
          </Button>
        </Stack>
      )}

      <Dialog open={showRepo} onClose={() => setShowRepo(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={600}>Exercise Repository</DialogTitle>
        <DialogContent>
          <ExerciseRepository onSelectExercise={handleSelectExercise} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRepo(false)} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
