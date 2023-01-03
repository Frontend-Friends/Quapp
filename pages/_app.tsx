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
import NavigationBar from '../components/navigation/navigation-bar'
import { Notifications } from '../components/notifications'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import clsx from 'clsx'

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
  const { asPath } = useRouter()

  const showNavbar = useMemo(() => {
    return asPath.startsWith('/community') || asPath.startsWith('/user')
  }, [asPath])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta property="og:title" content={t('HTML_TITLE_general')} />
        <meta property="og:description" content={t('HTML_META_description')} />
        <meta name="description" content={t('HTML_META_description')} />
        <meta
          property="og:image"
          content="https://www.quapp.org/og_screenshot.jpg"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.quapp.org" />

        <title>{t('HTML_TITLE_general')}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className={clsx(
            'flex min-h-screen min-w-[340px] flex-col justify-between',
            showNavbar && 'md:mt-[83px]'
          )}
        >
          <Component {...pageProps} />
          <Footer />
        </div>
        {showNavbar && <NavigationBar />}
        <Notifications />
      </ThemeProvider>
    </CacheProvider>
  )
}
