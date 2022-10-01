import { createTheme } from '@mui/material/styles'

// Create a theme instance.
// Theme tree structure: https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette
const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: '#0072ff',
      light: '#338eff',
      dark: '#005fd4',
    },
    secondary: {
      main: '#00E676',
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
  typography: {
    fontFamily: 'Nunito, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      letterSpacing: '0',
      lineHeight: '1em',
      fontWeight: '700',
    },
    h2: {
      fontSize: '2.5rem',
      letterSpacing: '0',
      lineHeight: '1em',
      fontWeight: '700',
    },
    h3: {
      fontSize: '2rem',
      letterSpacing: '0',
      lineHeight: '1em',
      fontWeight: '700',
    },
  },
})

export default theme
