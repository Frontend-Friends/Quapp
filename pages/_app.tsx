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
import { Snackbar } from '../components/snackbar/snackbar'

const domain = 'quapp.org'
const protocolSubdomain = 'https://www.'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  const t = useTranslation()
  const { asPath } = useRouter()

  const showNavbar = useMemo(() => {
    return asPath != '/'
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
          content={`${protocolSubdomain + domain}/og_screenshot.jpg`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={protocolSubdomain + domain} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={domain} />
        <meta property="twitter:url" content={protocolSubdomain + domain} />
        <meta name="twitter:title" content={t('HTML_TITLE_general')} />
        <meta name="twitter:description" content={t('HTML_META_description')} />
        <meta
          name="twitter:image"
          content={`${protocolSubdomain + domain}/og_screenshot.jpg`}
        />

        <title>{t('HTML_TITLE_general')}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className={clsx(
            'flex min-h-screen min-w-[340px] flex-col justify-between',
            showNavbar && 'md:pt-[83px]'
          )}
        >
          <div className="grow bg-[url(/assets/img/neighbourhood.svg)] bg-[length:auto_300px] bg-bottom bg-repeat-x">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
        {showNavbar && <NavigationBar />}
        <Notifications />
        <Snackbar />
      </ThemeProvider>
    </CacheProvider>
  )
}
