import { useState } from 'react'
import { Box, Typography, Paper, Stack, TextField, Button, MenuItem, IconButton } from '@mui/material'
import { Send, Trash2, User, Clock } from 'lucide-react'
import { useApp } from '../stores/appStore'

export default function CoachNotes() {
  const { clients, coachingNotes, addCoachingNote, deleteCoachingNote } = useApp()
  const [selectedClient, setSelectedClient] = useState('')
  const [content, setContent] = useState('')

  const clientNotes = coachingNotes
    .filter(n => n.clientId === selectedClient)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const selectedName = clients.find(c => c.id === selectedClient)?.name || ''

  const handleSend = async () => {
    if (!content.trim() || !selectedClient) return
    await addCoachingNote({
      clientId: selectedClient,
      clientName: selectedName,
      content: content.trim(),
      author: 'coach',
    })
    setContent('')
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Coaching Notes</Typography>
        <Typography variant="body2" color="text.secondary">Drop instructions, feedback, and info for your clients</Typography>
      </Box>

      <TextField
        select
        label="Select Client"
        size="small"
        value={selectedClient}
        onChange={e => setSelectedClient(e.target.value)}
        sx={{ maxWidth: 320 }}
      >
        {clients.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
      </TextField>

      {selectedClient && (
        <>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>New Note for {selectedName}</Typography>
            <Stack spacing={1.5}>
              <TextField
                multiline
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write instructions, feedback, meal tips, workout notes..."
                size="small"
                fullWidth
              />
              <Button
                variant="contained"
                endIcon={<Send size={16} />}
                onClick={handleSend}
                disabled={!content.trim()}
                sx={{ textTransform: 'none', fontWeight: 600, alignSelf: 'flex-end', borderRadius: 2 }}
              >
                Push to Client
              </Button>
            </Stack>
          </Paper>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Previous Notes ({clientNotes.length})
            </Typography>
            {clientNotes.length > 0 ? (
              <Stack spacing={1.5}>
                {clientNotes.map(note => (
                  <Paper key={note.id} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{note.content}</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <User size={12} />
                            <Typography variant="caption" fontWeight={600} color={note.author === 'coach' ? 'indigo.600' : 'text.secondary'}>
                              {note.author === 'coach' ? 'You' : note.clientName}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Clock size={12} />
                            <Typography variant="caption" color="text.disabled">{new Date(note.createdAt).toLocaleDateString()}</Typography>
                          </Stack>
                        </Stack>
                      </Box>
                      {note.author === 'coach' && (
                        <IconButton size="small" onClick={() => deleteCoachingNote(note.id)} color="error">
                          <Trash2 size={14} />
                        </IconButton>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.disabled">No notes yet. Write something above!</Typography>
            )}
          </Box>
        </>
      )}

      {!selectedClient && (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
          <User size={40} />
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>Select a client to view and write notes</Typography>
        </Paper>
      )}
    </Box>
  )
}
