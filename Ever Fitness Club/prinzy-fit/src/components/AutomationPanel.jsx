import { useState, useCallback } from 'react'
import { Box, Typography, Paper, Button, Stack, Switch, FormControlLabel, TextField, MenuItem, Chip, IconButton, Alert } from '@mui/material'
import { Plus, Trash2, Zap, Bell, Mail, MessageSquare, Calendar, Dumbbell } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { defaultAutomationRules as fallbackRules } from '../data/seedData'

const ACTIONS = [
  { value: 'send_welcome_email', label: 'Send Welcome Email', icon: Mail },
  { value: 'send_sms', label: 'Send SMS Notification', icon: MessageSquare },
  { value: 'create_onboarding_session', label: 'Create Onboarding Session', icon: Calendar },
  { value: 'assign_program', label: 'Assign Program', icon: Dumbbell },
  { value: 'notify_coach', label: 'Notify Coach', icon: Bell },
]

const TRIGGERS = [
  { value: 'booking_confirmed', label: 'Booking Confirmed' },
  { value: 'payment_received', label: 'Payment Received' },
  { value: 'payment_failed', label: 'Payment Failed' },
  { value: 'first_session_completed', label: 'First Session Completed' },
]

function AutomationRule({ rule, index, onChange, onRemove, onToggle }) {
  const ActionIcon = ACTIONS.find(a => a.value === rule.action)?.icon || Zap

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'amber.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ActionIcon size={16} className="text-amber-600" />
          </Box>
          <Typography variant="subtitle2" fontWeight={600}>Rule #{index + 1}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <FormControlLabel control={<Switch size="small" checked={rule.active} onChange={() => onToggle(index)} />} label="" sx={{ mr: 0 }} />
          <IconButton size="small" onClick={() => onRemove(index)} color="error"><Trash2 size={14} /></IconButton>
        </Stack>
      </Stack>
      <Stack spacing={1.5}>
        <TextField select label="Trigger" size="small" value={rule.trigger} onChange={e => onChange(index, 'trigger', e.target.value)} fullWidth>
          {TRIGGERS.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
        </TextField>
        <TextField select label="Action" size="small" value={rule.action} onChange={e => onChange(index, 'action', e.target.value)} fullWidth>
          {ACTIONS.map(a => <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>)}
        </TextField>
        {rule.action === 'assign_program' && (
          <TextField label="Program ID (optional)" size="small" value={rule.programId || ''} onChange={e => onChange(index, 'programId', e.target.value)} fullWidth placeholder="Leave empty for auto-assign" />
        )}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        <Chip label={`Trigger: ${TRIGGERS.find(t => t.value === rule.trigger)?.label || rule.trigger}`} size="small" variant="outlined" />
        <Chip label={`Action: ${ACTIONS.find(a => a.value === rule.action)?.label || rule.action}`} size="small" variant="outlined" />
      </Stack>
    </Paper>
  )
}

export default function AutomationPanel() {
  const { automationRules, addAutomationRule, updateAutomationRule } = useApp()
  const [rules, setRules] = useState(automationRules.length > 0 ? automationRules : fallbackRules)
  const [saved, setSaved] = useState(false)

  const updateRule = useCallback((index, field, value) => {
    setRules(rules.map((r, i) => i === index ? { ...r, [field]: value } : r))
    setSaved(false)
  }, [rules])

  const addRule = useCallback(() => {
    setRules([...rules, { trigger: 'booking_confirmed', action: 'notify_coach', active: true }])
    setSaved(false)
  }, [rules])

  const removeRule = useCallback((index) => {
    setRules(rules.filter((_, i) => i !== index))
    setSaved(false)
  }, [rules])

  const toggleRule = useCallback((index) => {
    const rule = rules[index]
    if (rule.id) {
      updateAutomationRule(rule.id, { active: !rule.active })
    }
    setRules(rules.map((r, i) => i === index ? { ...r, active: !r.active } : r))
  }, [rules, updateAutomationRule])

  const handleSave = useCallback(async () => {
    for (const rule of rules) {
      if (rule.id) {
        await updateAutomationRule(rule.id, rule)
      } else {
        await addAutomationRule(rule)
      }
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [rules, addAutomationRule, updateAutomationRule])

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Automation Panel</Typography>
          <Typography variant="body2" color="text.secondary">Specify what happens after a client books and pays</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {saved && <Alert severity="success" sx={{ py: 0, px: 1.5, borderRadius: 2 }}>Saved!</Alert>}
          <Button variant="contained" onClick={handleSave} startIcon={<Zap size={16} />} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>Save Rules</Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {rules.map((rule, i) => (
          <AutomationRule key={i} rule={rule} index={i} onChange={updateRule} onRemove={removeRule} onToggle={toggleRule} />
        ))}
      </Stack>

      <Button variant="outlined" startIcon={<Plus size={16} />} onClick={addRule} sx={{ textTransform: 'none', borderRadius: 2, alignSelf: 'flex-start' }}>
        Add Automation Rule
      </Button>
    </Box>
  )
}
