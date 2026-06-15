import { useState } from 'react'
import { Box, Typography, Paper, Stack, Chip, LinearProgress, Divider, Collapse } from '@mui/material'
import { Dumbbell, Clock, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import { defaultChecklistTasks as fallbackTasks } from '../data/seedData'

export default function WorkoutChecklist() {
  const [tasks, setTasks] = useState(fallbackTasks)
  const [expanded, setExpanded] = useState(true)

  const completedCount = tasks.filter(t => t.completed).length
  const progress = Math.round((completedCount / tasks.length) * 100)

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const categories = [
    { key: 'warmup', label: 'Warm-up', color: 'info' },
    { key: 'main', label: 'Main Workout', color: 'primary' },
    { key: 'accessory', label: 'Accessory', color: 'warning' },
    { key: 'cooldown', label: 'Cool-down', color: 'success' },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      <Stack spacing={3}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: 'indigo.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={24} className="text-indigo-600" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700}>Today's Workout</Typography>
              <Typography variant="body2" color="text.secondary">Upper Body Focus · {tasks.length} exercises</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" fontWeight={700} color="indigo.600">{progress}%</Typography>
              <Typography variant="caption" color="text.secondary">complete</Typography>
            </Box>
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'grey.100' }} />
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
            onClick={() => setExpanded(!expanded)}
          >
            <Typography variant="subtitle2" fontWeight={600}>{completedCount} of {tasks.length} completed</Typography>
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </Stack>
          <Collapse in={expanded}>
            <Divider />
            <Box sx={{ p: 2 }}>
              {categories.map(cat => {
                const catTasks = tasks.filter(t => t.category === cat.key)
                if (catTasks.length === 0) return null
                return (
                  <Box key={cat.key} sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={600} color={`${cat.color}.main`} sx={{ mb: 1, display: 'block' }}>
                      {cat.label}
                    </Typography>
                    <Stack spacing={1}>
                      {catTasks.map(task => (
                        <Paper
                          key={task.id}
                          elevation={0}
                          sx={{
                            p: 1.5, borderRadius: 1.5, border: '1px solid',
                            borderColor: task.completed ? 'success.light' : 'divider',
                            bgcolor: task.completed ? 'success.50' : 'transparent',
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            cursor: 'pointer', transition: 'all 0.2s',
                            '&:hover': { borderColor: 'indigo.200' },
                          }}
                          onClick={() => toggleTask(task.id)}
                        >
                          {task.completed ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                          ) : (
                            <Circle size={20} className="text-gray-300" />
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={500} sx={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'text.disabled' : 'text.primary' }}>
                              {task.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                              <Clock size={12} />
                              <Typography variant="caption" color="text.disabled">{task.duration}</Typography>
                              {task.sets && (
                                <Typography variant="caption" color="text.disabled">{task.sets}×{task.reps}{task.weight ? ` @ ${task.weight}` : ''}</Typography>
                              )}
                            </Stack>
                          </Box>
                          <Chip label={task.completed ? 'Done' : 'Pending'} size="small" color={task.completed ? 'success' : 'default'} variant="outlined" sx={{ fontSize: 10 }} />
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )
              })}
            </Box>
          </Collapse>
        </Paper>
      </Stack>
    </Box>
  )
}
