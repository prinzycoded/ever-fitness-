import { useState } from 'react'
import { Box, Typography, Paper, Button, Stack, Grid, TextField, Chip, LinearProgress, MobileStepper } from '@mui/material'
import { ChevronLeft, ChevronRight, Dumbbell, Clock, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react'
import { defaultTrainingExercises as fallbackExercises } from '../data/seedData'

function RestTimer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [running, setRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(null)

  const startTimer = () => {
    if (intervalId) clearInterval(intervalId)
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          setRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    setIntervalId(id)
    setRunning(true)
  }

  const pauseTimer = () => {
    if (intervalId) clearInterval(intervalId)
    setIntervalId(null)
    setRunning(false)
  }

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId)
    setIntervalId(null)
    setRunning(false)
    setTimeLeft(duration)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center', bgcolor: 'grey.50' }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>REST TIMER</Typography>
      <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>{minutes}:{seconds.toString().padStart(2, '0')}</Typography>
      <Stack direction="row" spacing={1} justifyContent="center">
        {!running ? (
          <Button size="small" variant="contained" startIcon={<Play size={14} />} onClick={startTimer} sx={{ textTransform: 'none', fontSize: 12 }}>Start</Button>
        ) : (
          <Button size="small" variant="contained" color="warning" startIcon={<Pause size={14} />} onClick={pauseTimer} sx={{ textTransform: 'none', fontSize: 12 }}>Pause</Button>
        )}
        <Button size="small" variant="outlined" startIcon={<RotateCcw size={14} />} onClick={resetTimer} sx={{ textTransform: 'none', fontSize: 12 }}>Reset</Button>
      </Stack>
    </Paper>
  )
}

function PerformanceInput({ exercise, index, onChange, value }) {
  return (
    <Box sx={{ bgcolor: 'grey.50', borderRadius: 1.5, p: 1.5 }}>
        <Grid container spacing={1}>
        <Grid item xs={6} sm={4}>
          <TextField
            type="number" size="small" label="Actual Sets"
            value={value?.actualSets ?? exercise.sets}
            onChange={e => onChange(index, 'actualSets', Number(e.target.value))}
            fullWidth
            slotProps={{
              htmlInput: { style: { textAlign: 'center' } },
              inputLabel: { sx: { fontSize: 12 } },
            }}
          />
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 0.25 }}>
            Target: {exercise.sets}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            type="number" size="small" label="Actual Reps"
            value={value?.actualReps ?? exercise.reps}
            onChange={e => onChange(index, 'actualReps', Number(e.target.value))}
            fullWidth
            slotProps={{
              htmlInput: { style: { textAlign: 'center' } },
              inputLabel: { sx: { fontSize: 12 } },
            }}
          />
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 0.25 }}>
            Target: {exercise.reps}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="number" size="small" label="Actual Weight"
            value={value?.actualWeight ?? exercise.weight}
            onChange={e => onChange(index, 'actualWeight', Number(e.target.value))}
            fullWidth
            slotProps={{
              htmlInput: { style: { textAlign: 'center' } },
              inputLabel: { sx: { fontSize: 12 } },
              input: { endAdornment: <Typography variant="caption" color="text.disabled">kg</Typography> },
            }}
          />
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 0.25 }}>
            Target: {exercise.weight}kg
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default function MyTrainingView() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState({})
  const [performance, setPerformance] = useState({})

  const exercise = fallbackExercises[currentIndex]

  const updatePerformance = (exIndex, field, value) => {
    setPerformance({ ...performance, [exIndex]: { ...(performance[exIndex] || {}), [field]: value } })
  }

  const markComplete = () => {
    setCompleted({ ...completed, [currentIndex]: true })
  }

  const progress = Object.keys(completed).length / fallbackExercises.length * 100

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, maxWidth: 800, mx: 'auto', pb: 8 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={700}>Today's Workout</Typography>
            <Typography variant="body2" color="text.secondary">Upper Body Focus</Typography>
          </Box>
          <Chip label={`${currentIndex + 1} of ${fallbackExercises.length}`} size="small" />
        </Stack>

        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />

        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ height: 200, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {exercise.imageUrl ? (
              <Box component="img" src={exercise.imageUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Stack alignItems="center" spacing={1}>
                <Dumbbell size={48} className="text-gray-300" />
                <Typography variant="caption" color="text.disabled">Exercise demonstration</Typography>
              </Stack>
            )}
          </Box>
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="h6" fontWeight={700}>{exercise.name}</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Clock size={14} />
                <Typography variant="caption" color="text.secondary">{exercise.restTime}s rest</Typography>
              </Stack>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
              {exercise.instructions}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip label={`${exercise.sets} × ${exercise.reps}`} size="small" variant="outlined" />
              {exercise.weight > 0 && <Chip label={`${exercise.weight}kg`} size="small" variant="outlined" />}
            </Stack>

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Your Performance
            </Typography>
            <PerformanceInput exercise={exercise} index={currentIndex} value={performance[currentIndex]} onChange={updatePerformance} />

            <RestTimer duration={exercise.restTime} />
          </Box>
        </Paper>

        <MobileStepper
          variant="dots"
          steps={fallbackExercises.length}
          position="static"
          activeStep={currentIndex}
          sx={{ bgcolor: 'transparent' }}
          nextButton={
            <Button size="small" onClick={() => { markComplete(); setCurrentIndex(Math.min(currentIndex + 1, fallbackExercises.length - 1)) }} disabled={currentIndex === fallbackExercises.length - 1} sx={{ textTransform: 'none' }}>
              Next <ChevronRight size={16} />
            </Button>
          }
          backButton={
            <Button size="small" onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))} disabled={currentIndex === 0} sx={{ textTransform: 'none' }}>
              <ChevronLeft size={16} /> Prev
            </Button>
          }
        />

        {currentIndex === fallbackExercises.length - 1 && (
          <Button variant="contained" color="success" size="large" startIcon={<CheckCircle size={20} />} onClick={markComplete} fullWidth sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.5 }}>
            Complete Workout
          </Button>
        )}
      </Stack>
    </Box>
  )
}
