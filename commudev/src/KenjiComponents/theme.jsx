import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f4f6f9',
    },
    primary: {
      main: '#3f51b5',
      light: '#6573c3',
      dark: '#2c387e',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Inter', 
      'Roboto', 
      'Helvetica', 
      'Arial', 
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    body1: {
      lineHeight: 1.6,
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-10px)',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          }
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3f51b5 30%, #6573c3 90%)',
        },
        outlinedError: {
          borderColor: '#f50057',
          color: '#f50057',
          '&:hover': {
            backgroundColor: 'rgba(245, 0, 87, 0.04)',
          }
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }
      }
    }
  }
});

export default theme;