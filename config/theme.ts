import { createTheme } from '@mui/material/styles'

// Create a theme instance.
// Theme tree structure: https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette
const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: '#D80062',
      light: '#338eff',
      dark: '#005fd4',
    },
    secondary: {
      main: '#57B894',
      light: '#21ff94',
      dark: '#00b45c',
    },
    error: {
      main: '#d53030',
    },
    background: {
      default: '#F3FAFD',
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: 'Jost, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '1.5rem',
      letterSpacing: '0',
      lineHeight: '1em',
      fontWeight: '500',
    },
    h2: {
      fontSize: '1.25rem',
      letterSpacing: '0',
      lineHeight: '1em',
      fontWeight: '500',
    },
    h3: {
      fontSize: '1rem',
      letterSpacing: '0',
      lineHeight: '1em',
      fontWeight: '500',
    },
  },
})

export default theme
