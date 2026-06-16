import { useState, useRef, useCallback } from 'react'
import { Box, Typography, Paper, Button, Stack, Grid, IconButton, Dialog, DialogTitle, DialogContent, TextField, MenuItem } from '@mui/material'
import { Camera, Upload, Trash2, Clock, Plus } from 'lucide-react'
import { useApp } from '../stores/appStore'
import { useAuth } from '../stores/authStore'

const categories = [
  { value: 'front', label: 'Front', color: 'indigo' },
  { value: 'side', label: 'Side', color: 'amber' },
  { value: 'back', label: 'Back', color: 'green' },
  { value: 'detail', label: 'Detail', color: 'purple' },
]

export default function ProgressPhotos() {
  const { progressPhotos, addProgressPhoto } = useApp()
  const { profile, user } = useAuth()
  const fileInputRef = useRef(null)
  const [photos, setPhotos] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ note: '', category: 'front', date: new Date().toISOString().slice(0, 10) })
  const [preview, setPreview] = useState(null)

  const clientPhotos = progressPhotos.filter(p => p.clientId === profile?.id || p.clientId === profile?.email)
  const displayPhotos = photos.length > 0 ? photos : clientPhotos

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = useCallback(async () => {
    const photo = {
      clientId: profile?.id || user?.email,
      clientName: profile?.name || user?.email,
      imageUrl: preview,
      note: uploadForm.note,
      category: uploadForm.category,
      date: uploadForm.date,
    }
    const created = await addProgressPhoto(photo)
    setPhotos([{ ...created, id: created.id || `p_${Date.now()}` }, ...displayPhotos])
    setShowUpload(false)
    setPreview(null)
    setUploadForm({ note: '', category: 'front', date: new Date().toISOString().slice(0, 10) })
  }, [uploadForm, preview, displayPhotos, addProgressPhoto, profile, user])

  const removePhoto = (id) => setPhotos(displayPhotos.filter(p => p.id !== id))

  const grouped = categories.map(cat => ({
    ...cat,
    photos: displayPhotos.filter(p => p.category === cat.value),
  }))

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h5" fontWeight={700}>Progress Photos</Typography>
            <Typography variant="body2" color="text.secondary">Track your transformation visually</Typography>
          </Box>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setShowUpload(true)} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Add Photos
          </Button>
        </Stack>

        {grouped.map(({ value: cat, label, color, photos: catPhotos }) => (
          <Box key={cat}>
            <Typography variant="subtitle2" fontWeight={600} color={`${color}.main`} sx={{ mb: 1.5, textTransform: 'capitalize' }}>
              {label} View
            </Typography>
            {catPhotos.length > 0 ? (
              <Grid container spacing={2}>
                {catPhotos.map(photo => (
                  <Grid item xs={12} sm={6} md={4} key={photo.id}>
                    <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: 200, bgcolor: 'grey.100',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundImage: photo.imageUrl ? `url(${photo.imageUrl})` : 'none',
                          backgroundSize: 'cover', backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      >
                        {!photo.imageUrl && (
                          <Camera size={40} className="text-gray-300" />
                        )}
                        <IconButton
                          size="small"
                          onClick={() => removePhoto(photo.id)}
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">{photo.note}</Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                          <Clock size={12} />
                          <Typography variant="caption" color="text.disabled">{photo.date}</Typography>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                <Camera size={32} className="text-gray-300" />
                <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>No {label.toLowerCase()} photos yet</Typography>
              </Paper>
            )}
          </Box>
        ))}

        <Dialog open={showUpload} onClose={() => setShowUpload(false)} maxWidth="sm" fullWidth>
          <DialogTitle fontWeight={600}>Upload Progress Photo</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box
                sx={{
                  height: 200, borderRadius: 2, border: '2px dashed', borderColor: 'divider',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100' },
                  backgroundImage: preview ? `url(${preview})` : 'none',
                  backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {!preview && (
                  <Stack alignItems="center" spacing={1}>
                    <Upload size={32} className="text-gray-300" />
                    <Typography variant="body2" color="text.disabled">Click to upload photo</Typography>
                  </Stack>
                )}
              </Box>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
              <TextField select label="Category" size="small" value={uploadForm.category} onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })} fullWidth>
                {categories.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
              </TextField>
              <TextField type="date" label="Date" size="small" value={uploadForm.date} onChange={e => setUploadForm({ ...uploadForm, date: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
              <TextField label="Notes" size="small" multiline rows={2} value={uploadForm.note} onChange={e => setUploadForm({ ...uploadForm, note: e.target.value })} fullWidth placeholder="e.g., Front view - week 3" />
              <Button variant="contained" onClick={handleUpload} disabled={!preview && !uploadForm.note} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                Upload Photo
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Stack>
    </Box>
  )
}
