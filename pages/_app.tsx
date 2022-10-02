import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { EmotionCache } from '@emotion/react'
import theme from '../config/theme'

import { Container } from '@mui/material'

import '../styles/globals.scss'
import { NavBar } from '../components/nav-bar'
import { Navigation } from '../mock/navigation'

// Client-side cache, shared for the whole session of the user in the browser.

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function App(props: MyAppProps) {
  const { Component, pageProps } = props

  return (
    <>
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
    </>
  )
}
