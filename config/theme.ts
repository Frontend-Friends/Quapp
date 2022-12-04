import { createTheme } from '@mui/material/styles'
import { theme as twTheme } from '../tailwind.config'

// Create a theme instance.
// Theme tree structure: https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette
const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: twTheme.extend.colors.violetRed[600],
      light: twTheme.extend.colors.violetRed[300],
      dark: twTheme.extend.colors.violetRed[900],
      contrastText: twTheme.extend.colors.violetRed.contrastText,
    },
    secondary: {
      main: twTheme.extend.colors.mintGreen[600],
      light: twTheme.extend.colors.mintGreen[300],
      dark: twTheme.extend.colors.mintGreen[900],
      contrastText: twTheme.extend.colors.mintGreen.contrastText,
    },
    error: {
      main: '#d53030',
    },
    background: {
      default: '#F3FAFD',
    },
  },
  typography: {
    fontFamily: 'Jost, Helvetica, Arial, sans-serif',
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
