import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../config/theme'
import createEmotionCache from '../config/create-emotion-cache'
import { Container } from '@mui/material'
import '../styles/globals.scss'
import { NavBar } from '../components/nav-bar/nav-bar'
import { Navigation } from '../mock/navigation'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Quapp - sharing is caring</title>
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar linkList={Navigation} />
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    </CacheProvider>
  )
}
