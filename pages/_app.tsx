
import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../config/theme';
import createEmotionCache from '../config/createEmotionCache';
import Nav from "../src/layout/Components/Nav";
import {AuthContextProvider} from "../context/AuthContext";


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App (props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (

      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width"  />
<title>Quapp - sharing is caring</title>
        </Head>

        <ThemeProvider theme={theme}>
            <AuthContextProvider>
          <CssBaseline />
            <Nav/>
          <Component {...pageProps} />
            </AuthContextProvider>
        </ThemeProvider>
      </CacheProvider>
  );
}