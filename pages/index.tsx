import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../lib/config'
import { FC } from 'react'
import { LogoSVG } from '../components/svg/quapp_logo'
import { AppartmentSVG } from '../components/svg/appartment'
import { WindowNeighboursSVG } from '../components/svg/windowneighbours'
import { CollaboratorSVG } from '../components/svg/collaborator'
import { HangoutSVG } from '../components/svg/hangout'
import { Box, Button, Divider, Link } from '@mui/material'
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

const Home: FC<{ isLoggedIn: boolean }> = () => {
  const t = useTranslation()
  return (
    <main className="w-full text-blueishGray-600">
      <section className="relative bg-gradient-to-b from-violetRed-600 via-violetRed-600 to-violetRed-900 pb-10 text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-7 grid-rows-[auto_auto_auto_auto_auto_auto_auto] p-3 lg:p-8 lg:pb-24">
          <LogoSVG
            aria-label={t('SVG_logo')}
            className="col-span-7 mx-auto block w-1/2 md:h-full md:w-1/5 lg:mb-10"
            preserveAspectRatio="xMidYMid meet"
          />
          <h1 className="col-span-7 text-center text-xl font-medium sm:col-start-3 sm:text-left md:text-2xl lg:pl-14 lg:text-3xl">
            {t('HOME_subtitle')}
          </h1>
          <AppartmentSVG className="col-span-3 row-span-2 -ml-6 h-[130px] w-full flex-1 sm:col-span-2 sm:-ml-14 sm:scale-125 md:scale-150 lg:scale-[2]" />
          <p className="col-span-4 row-span-2 m-0 flex-1 text-lg font-light sm:col-span-4 md:text-2xl lg:row-span-1 lg:pl-14">
            {t('HOME_intro')}
          </p>
          <Link
            underline="none"
            href="/auth/signup"
            className="col-span-7 mx-auto mt-5 mb-3 block md:col-start-3 md:mx-[unset] md:mt-0 lg:mb-6 lg:mt-8 lg:pl-14"
          >
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className="px-12 md:py-3 md:text-xl lg:py-4 lg:text-2xl"
            >
              {t('HOME_signup_free')}
            </Button>
          </Link>
          <Box className="col-span-7 text-center md:col-start-3 md:text-left lg:pl-14 lg:text-xl">
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
          className="xl:h-30 pointer-events-none absolute bottom-0 w-full touch-none sm:h-12 md:h-14 lg:h-28"
        />
      </section>
      <section className="mx-auto max-w-[1280px] flex-row p-3 lg:flex lg:p-8 lg:pt-14">
        <WindowNeighboursSVG className="w-full lg:w-1/2" />
        <div className="p-3 md:pt-12 lg:order-first lg:w-1/2">
          <h2 className="m-0 text-center font-medium md:text-3xl lg:text-left lg:text-5xl">
            {t('HOME_support_title')}
          </h2>
          <Divider className="my-3 lg:my-6" />
          <p className="mt-1 text-center text-lg md:text-2xl lg:pr-6 lg:text-left lg:text-2xl">
            {t('HOME_support_text')}
          </p>
        </div>
      </section>
      <section className="mb-10 pb-10 lg:p-8">
        <div className="relative mx-auto max-w-[1280px] bg-gradient-to-t from-slate-300 to-slate-200">
          <WaveWhiteTopSVG
            preserveAspectRatio="none"
            className="absolute top-0 w-full sm:h-24 lg:h-28"
          />
          <div className="pb-32 text-center sm:pb-20 md:pb-20 lg:flex lg:items-center lg:py-20">
            <CollaboratorSVG className="relative h-[256px] lg:basis-2/6" />
            <div className="relative z-10 p-3 lg:flex lg:basis-4/6 lg:gap-10 lg:p-8">
              <div className="text-left lg:text-right">
                <h2 className="m-0 text-3xl font-medium md:text-3xl lg:text-5xl">
                  {t('HOME_spaces_title')}
                </h2>
                <Divider className="my-3 w-1/2 lg:my-6 lg:ml-auto" />
                <p className="mt-1 text-lg md:text-2xl lg:text-2xl">
                  {t('HOME_spaces_text')}
                </p>
              </div>
              <div className="text-right lg:text-left">
                <h2 className="m-0 text-3xl font-medium md:text-3xl lg:text-5xl">
                  {t('HOME_offers_title')}
                </h2>
                <Divider className="my-3 ml-auto w-1/2 lg:my-6 lg:ml-[unset]" />
                <p className="mt-1 text-lg md:text-2xl lg:text-2xl">
                  {t('HOME_offers_text')}
                </p>
              </div>
            </div>
          </div>
          <WaveWhiteBottomSVG
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full sm:h-24 lg:h-28"
          />
        </div>
      </section>
      <section className="mx-auto max-w-[1280px] p-3 lg:p-8">
        <div className="relative">
          <h2 className="absolute m-0 w-1/2 pl-[30%] text-left text-4xl font-medium">
            {t('HOME_support_title')}
          </h2>
          <HangoutSVG className="-ml-20 h-[256px] w-full" />
        </div>
        <p className="p-3 text-center">{t('HOME_support_text')}</p>
      </section>
    </main>
  )
}
export default Home
