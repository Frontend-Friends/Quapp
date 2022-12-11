import Head from 'next/head'
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
import Footer from '../components/footer'

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

      <main className="text-blueishGray-600">
        <section className="relative bg-gradient-to-br from-violetRed-600 via-violetRed-600 to-violetRed-900 pb-10 text-white">
          <div className="p-3">
            <LogoSVG
              aria-labelledby="LogoTitle"
              className="mx-auto block w-1/2"
            />
            <h1 className="text-center text-lg font-medium">
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
            <h2 className="m-0 text-center font-medium">
              Sich gegenseitig unterstützen.
            </h2>
            <p className="mt-1 text-center">
              Wer kennt es nicht: Man braucht mal eben kurz eine Bohrmaschine
              oder jemanden der einem fünf Minuten hilft einen Tisch zu tragen,
              aber man kennt die Nachbarn nocht nicht und hat niemanden zum
              Fragen.
            </p>
          </div>
        </section>
        <section className="relative mb-10 bg-gradient-to-t from-slate-300 to-slate-200 pb-24">
          <WaveWhiteTopSVG
            preserveAspectRatio="none"
            className="absolute top-0 w-full"
          />
          <CollaboratorSVG className="relative h-[256px] w-full" />
          <div className="p-3">
            <h2 className="m-0 text-3xl font-medium">Spaces.</h2>
            <p className="mt-1">
              Indem du selbst einen Space erstellst oder einem vorhandenen Space
              mit einer Einladung beitrittst, wirst du Teil der Gemeinschaft.
            </p>
            <h2 className="m-0 text-right text-3xl font-medium">Angebote.</h2>
            <p className="mt-1 text-right">
              Logge dich ein und durchsuche die Angebote deiner Nachbarn oder
              stelle einfach selbst ein Angebot für andere ein.
            </p>
          </div>
          <WaveWhiteBottomSVG
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full"
          />
        </section>
        <section>
          <div className="relative">
            <h2 className="absolute m-0 w-1/2 pl-[30%] text-left text-4xl font-medium">
              Gemeinsam Nachbarn sein.
            </h2>
            <HangoutSVG className="-ml-20 h-[256px] w-full" />
          </div>
          <p className="p-3 text-center">
            Sharing is caring - nach dieser Devise sollte unserer Meinung nach,
            jede Nachbarschaft leben! <strong>Quapp</strong> ermöglicht es dir
            ganz einfach Kontakt zu deiner Nachbarschaft aufzubauen und sich
            gegenseitig zu unterstützen.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
export default Home
