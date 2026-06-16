import { useState } from 'react'
import { Box, Typography, Paper, Stack, TextField, Button } from '@mui/material'
import { Send, User } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { useAuth } from '../stores/authStore'

export default function MyCoach() {
  const { coach, coachingNotes, addCoachingNote } = useApp()
  const { profile } = useAuth()
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const myNotes = coachingNotes
    .filter(n => n.clientId === profile?.id || n.clientId === profile?.email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const coachNotes = myNotes.filter(n => n.author === 'coach')
  const clientNotes = myNotes.filter(n => n.author !== 'coach')

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    await addCoachingNote({
      clientId: profile?.id || profile?.email,
      clientName: profile?.name || 'Client',
      content: message.trim(),
      author: 'client',
    })
    setMessage('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  if (!coach) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="body2" color="text.disabled">Coach information not available yet.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>My Coach</Typography>
        <Typography variant="body2" color="text.secondary">Your personal trainer and guide</Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'indigo.100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'indigo.700' }}>
            {coach.name?.split(' ').map(n => n[0]).join('')}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>{coach.name}</Typography>
            <Typography variant="body2" color="text.secondary">{coach.specialization}</Typography>
          </Box>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, flex: 1 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Email</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{coach.email}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, flex: 1 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">Phone</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{coach.phone || '—'}</Typography>
          </Paper>
        </Stack>
      </Paper>

      {coachNotes.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Coach's Notes</Typography>
          <Stack spacing={1.5}>
            {coachNotes.map(note => (
              <Paper key={note.id} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'indigo.100', bgcolor: 'indigo.50' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{note.content}</Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Send a Message</Typography>
        <Box component="form" onSubmit={handleSend}>
          <Stack spacing={2}>
            <TextField
              multiline
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask your coach a question or share an update..."
              size="small"
              fullWidth
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                type="submit"
                variant="contained"
                disabled={!message.trim()}
                startIcon={<Send size={16} />}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Send Message
              </Button>
              {sent && (
                <Typography variant="caption" color="success.main" fontWeight={600}>Message sent!</Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {clientNotes.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Your Messages</Typography>
          <Stack spacing={1}>
            {clientNotes.map(note => (
              <Stack key={note.id} direction="row" spacing={1.5} alignItems="flex-start" sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={14} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{note.content}</Typography>
                  <Typography variant="caption" color="text.disabled">{new Date(note.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  )
}
