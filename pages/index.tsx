import Head from 'next/head'
import styles from '../styles/home.module.scss'
import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../lib/config'
import React from 'react'
import { LogoSVG } from '../components/svg/quapp_logo'
import { AppartmentSVG } from '../components/svg/appartment'
import { WindowNeighboursSVG } from '../components/svg/windowneighbours'
import { CollaboratorSVG } from '../components/svg/collaborator'
import { HangoutSVG } from '../components/svg/hangout'
import { Box, Button, Link } from '@mui/material'
import { useTranslation } from '../hooks/use-translation'
import { WaveWhiteSVG } from '../components/svg/wave_white'
import { WaveWhiteBottomSVG } from '../components/svg/wave_white_bottom'
import { WaveWhiteTopSVG } from '../components/svg/wave_white_top'

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { user } = req.session
  return {
    props: { isLoggedIn: !!user },
  }
}, ironOptions)

const Home: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const t = useTranslation()
  console.log(isLoggedIn)
  return (
    <>
      <Head>
        <title>Quapp - Die App die Nachbarn verbindet</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#d80062" />
        <meta name="msapplication-TileColor" content="#d80062" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Quapp hilft dir Kontakt mit deiner Nachbarschaft herzustellen und sich gegenseitig mit Hilfe oder Leihgaben zu unterstützen."
        />
      </Head>

      <main>
        <section
          className={`relative bg-gradient-to-br from-violetRed-600 via-violetRed-600 to-violetRed-900 pb-10 text-white`}
        >
          <div className="p-3">
            <LogoSVG className="mx-auto block w-1/2" />
            <h1 className="text-center text-lg font-normal">
              Die App die Nachbarn verbindet.
            </h1>
            <div className="flex gap-5">
              <AppartmentSVG className="-ml-24 h-[130px] w-full flex-1" />
              <p className="m-0 flex-1 font-light">
                Du brauchst ein Werkzeug oder eine helfende Hand? Quapp
                ermöglicht dir einfachen Kontakt zu deinen Nachbarn!
              </p>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className="mx-auto mt-5 mb-3 block px-16"
            >
              {t('HOME_signup_free')}
            </Button>
            <Box className="text-center">
              <Link
                underline="hover"
                href="/auth/login"
                className="text-white underline"
              >
                {t('LOGIN_has_account')}
              </Link>
            </Box>
          </div>
          <WaveWhiteSVG
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full"
          />
        </section>

        <section>
          <WindowNeighboursSVG className="w-full" />
          <div className="p-3">
            <h2 className="m-0 text-center text-xl text-blueishGray-600">
              Sich gegenseitig unterstützen.
            </h2>
            <p className="text-center text-blueishGray-600">
              Wer kennt es nicht: Man braucht mal eben kurz eine Bohrmaschine
              oder jemanden der einem fünf Minuten hilft einen Tisch zu tragen,
              aber man kennt die Nachbarn nocht nicht und hat niemanden zum
              Fragen.
            </p>
          </div>
        </section>

        <section className="relative bg-slate-300">
          <WaveWhiteTopSVG
            preserveAspectRatio="none"
            className="absolute top-0 w-full"
          />
          <CollaboratorSVG className="relative h-[256px] w-full" />
          <h2>Spaces.</h2>
          <p>
            Indem du selbst einen Space erstellst oder einem vorhandenen Space
            mit einer Einladung beitrittst, wirst du Teil der Gemeinschaft.
          </p>
          <h2>Angebote.</h2>
          <p>
            Logge dich ein und durchsuche die Angebote deiner Nachbarn oder
            stelle einfach selbst ein Angebot für andere ein.
          </p>
          <WaveWhiteBottomSVG
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full"
          />
        </section>

        <section>
          <HangoutSVG className="h-[256px] w-full" />
          <h2>Gemeinsam Nachbarn sein.</h2>
          <p>
            Sharing is caring - nach dieser Devise sollte unserer Meinung nach,
            jede Nachbarschaft leben! <strong>Quapp</strong> ermöglicht es dir
            ganz einfach Kontakt zu deiner Nachbarschaft aufzubauen und sich
            gegenseitig zu unterstützen.
          </p>
        </section>
      </main>

      <footer className={styles.footer}></footer>
    </>
  )
}
export default Home
