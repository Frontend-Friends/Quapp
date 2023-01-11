import { withIronSessionSsr } from 'iron-session/next'
import { ironOptions } from '../lib/config'
import { FC, useEffect, useState } from 'react'
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
import { useRouter } from 'next/router'
import { fetchJson } from '../lib/helpers/fetch-json'

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const { user } = req.session
  return {
    props: { isLoggedIn: !!user },
  }
}, ironOptions)

const userExists = async () => {
  const user: { isUser: boolean } = await fetchJson(' /api/cookie')
  return user.isUser
}

const Home: FC<{ isLoggedIn: boolean }> = () => {
  const t = useTranslation()
  const [isUser, setIsUser] = useState(false)
  const { asPath } = useRouter()

  useEffect(() => {
    const user = userExists().then((res) => res)
    user.then((res) => setIsUser(res))
  }, [asPath])

  return (
    <main className="w-full text-blueishGray-600">
      <section className="relative bg-gradient-to-b from-violetRed-600 via-violetRed-600 to-violetRed-900 pb-10 text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-7 grid-rows-[auto_auto_auto_auto_auto_auto_auto] p-3 lg:p-8 lg:pb-24">
          <LogoSVG
            aria-label={t('SVG_logo')}
            className="col-span-7 mx-auto block w-1/2 md:h-full md:w-1/5 lg:mb-10"
            preserveAspectRatio="xMidYMid meet"
          />
          <h1 className="col-span-7 text-center text-xl font-medium sm:col-start-3 sm:text-left md:text-xl lg:pl-14 lg:text-2xl 2xl:col-start-4">
            {t('HOME_subtitle')}
          </h1>
          <AppartmentSVG
            aria-label={t('SVG_appartment')}
            className="col-span-3 row-span-2 -ml-6 h-[130px] w-full flex-1 sm:col-span-2 sm:-ml-14 sm:scale-125 md:scale-150 lg:scale-[2] 2xl:col-span-3 2xl:-ml-0 2xl:scale-[2.3]"
          />
          <p className="col-span-4 row-span-2 m-0 flex-1 text-lg sm:col-span-4 md:text-xl lg:row-span-1 lg:pl-14 2xl:col-span-4">
            {!isUser ? t('HOME_intro') : t('HOME_is_logged_in')}
          </p>

          {!isUser ? (
            <>
              <Link
                underline="none"
                href="/auth/signup"
                className="col-span-7 mx-auto mt-6 mb-5 block md:col-start-3 md:mx-[unset] md:mt-0 lg:mb-6 lg:mt-8 lg:pl-14 2xl:col-span-4"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className="px-12 py-3 md:text-lg lg:py-4 lg:text-xl"
                >
                  {t('HOME_signup_free')}
                </Button>
              </Link>
              <Box className="col-span-7 text-center md:col-start-3 md:text-left lg:pl-14 lg:text-xl 2xl:col-start-4">
                <Link
                  underline="hover"
                  href="/auth/login"
                  className="text-white underline"
                >
                  {t('LOGIN_has_account')}
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Link
                underline="none"
                href="/community/dashboard"
                className="col-span-7 mx-auto mt-6 mb-5 block md:col-start-3 md:mx-[unset] md:mt-0 lg:mb-6 lg:mt-8 lg:pl-14 2xl:col-span-4"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className="px-12 py-3 md:text-lg lg:py-4 lg:text-xl"
                >
                  {t('HOME_to_dashboard')}
                </Button>
              </Link>
            </>
          )}
        </div>
        <WaveWhiteSVG
          preserveAspectRatio="none"
          className="xl:h-30 pointer-events-none absolute bottom-0 w-full touch-none sm:h-12 md:h-14 lg:h-28"
        />
      </section>
      <section className="mx-auto max-w-[1280px] flex-row items-center p-3 lg:flex lg:p-8 lg:pt-14">
        <WindowNeighboursSVG
          aria-label={t('SVG_windowneighbours')}
          className="w-full lg:w-1/2"
        />
        <div className="sm:p-3 md:pt-12 lg:order-first lg:w-1/2">
          <h2 className="m-0 text-center font-medium md:text-2xl lg:text-left lg:text-3xl">
            {t('HOME_support_title')}
          </h2>
          <Divider className="my-3 lg:my-6" />
          <p className="mt-1 text-center text-lg md:text-xl lg:pr-6 lg:text-left">
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
            <CollaboratorSVG
              aria-label={t('SVG_collaborator')}
              className="relative h-[256px] lg:basis-2/6"
            />
            <div className="relative z-10 p-3 lg:flex lg:basis-4/6 lg:gap-10 lg:p-8">
              <div className="text-left sm:p-3">
                <h2 className="m-0 text-2xl font-medium md:text-3xl">
                  {t('HOME_spaces_title')}
                </h2>
                <Divider className="my-3 w-1/2 lg:my-6" />
                <p className="mt-1 text-lg md:text-xl lg:text-xl">
                  {t('HOME_spaces_text')}
                </p>
              </div>
              <div className="text-right sm:p-3 lg:text-left">
                <h2 className="m-0 text-2xl font-medium md:text-3xl">
                  {t('HOME_offers_title')}
                </h2>
                <Divider className="my-3 ml-auto w-1/2 lg:my-6 lg:ml-[unset]" />
                <p className="mt-1 text-lg md:text-xl lg:text-xl">
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
      <section className="relative mx-auto flex max-w-[1280px] flex-col items-center bg-white p-3 pb-16 lg:flex-row lg:flex-wrap lg:p-8">
        <h2 className="absolute left-1/3 z-10 m-0 w-1/2 text-left text-4xl font-medium lg:static lg:order-1 lg:flex-[0_0_100%]">
          {t('HOME_support_title')}
        </h2>
        <HangoutSVG
          aria-label={t('SVG_hangout')}
          className="-ml-20 w-full lg:order-4 lg:ml-auto lg:h-[384px] lg:flex-[0_0_33%] lg:shrink lg:scale-x-[-1]"
        />
        <Divider className="mt-7 w-full lg:order-2" />
        <p className="text-center text-lg md:text-xl lg:order-3 lg:flex-[0_0_66%] lg:self-start lg:text-left lg:text-2xl">
          {t('HOME_support_text')}
        </p>
      </section>
    </main>
  )
}
export default Home
