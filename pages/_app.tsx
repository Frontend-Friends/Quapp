import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../config/theme";
import createEmotionCache from "../config/create-emotion-cache";
import Nav from "../layout/Components/Nav";
import { AuthContextProvider } from "../components/context/auth-context";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/auth/protected-route";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: MyAppProps) {
  const router = useRouter();
  const noAuthRequired = ["/", "/login", "/signup"];

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Quapp - sharing is caring</title>
      </Head>

      <ThemeProvider theme={theme}>
        <AuthContextProvider>
          <CssBaseline />
          <Nav />
          {noAuthRequired.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            // @ts-ignore
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </AuthContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
