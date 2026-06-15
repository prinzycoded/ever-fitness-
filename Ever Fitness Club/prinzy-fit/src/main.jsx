import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6d28d9', light: '#8b5cf6', dark: '#5b21b6' },
    secondary: { main: '#059669', light: '#10b981', dark: '#047857' },
    success: { main: '#059669' },
    info: { main: '#2563eb' },
    warning: { main: '#d97706' },
    error: { main: '#dc2626' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: false },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 10, padding: '8px 20px', fontSize: '0.875rem' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
          boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(124,58,237,0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5 },
        },
        sizeSmall: { padding: '6px 14px', fontSize: '0.8125rem' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#64748b',
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: '#f1f5f9', padding: '12px 16px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
        outlined: { borderWidth: 1.5 },
        sizeSmall: { fontSize: '0.75rem' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          border: '1.5px solid',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: '#fff',
            '&:hover': { background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': { fontWeight: 500 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: '1.125rem', fontWeight: 700 },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
