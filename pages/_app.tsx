import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../config/theme'
import createEmotionCache from '../config/create-emotion-cache'
import '../styles/globals.scss'
import { useTranslation } from '../hooks/use-translation'
import Footer from '../components/footer'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps<{ isLoggedIn: boolean }> {
  emotionCache?: EmotionCache
  pageProps: { isLoggedIn: boolean }
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  const t = useTranslation()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{t('HTML_TITLE_general')}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="flex min-h-screen flex-col justify-between">
          <Component {...pageProps} />
          <Footer />
        </div>
      </ThemeProvider>
    </CacheProvider>
  )
}
