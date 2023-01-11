import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import React, { FC, useEffect, useState } from 'react'
import { Button, Link } from '@mui/material'
import { useRouter } from 'next/router'
import { LogoSVG } from '../svg/quapp_logo'
import { UserIcon } from '../user/user-icon'
import { useTranslation } from '../../hooks/use-translation'
import { fetchJson } from '../../lib/helpers/fetch-json'
import clsx from 'clsx'

const userExists = async () => {
  const user: { isUser: boolean } = await fetchJson(' /api/cookie')
  return user.isUser
}
export const twNavbarButton =
  'aspect-square border-0 rounded-full bg-white text-violetRed-600 hover:bg-white md:min-w-[32px]'
const NavigationBar: FC = () => {
  const t = useTranslation()
  const [isUser, setIsUser] = useState(false)
  const { asPath } = useRouter()

  const router = useRouter()

  useEffect(() => {
    const user = userExists().then((res) => res)
    user.then((res) => setIsUser(res))
  }, [asPath])

  return (
    <nav
      className="
      fixed
      bottom-0
      z-50
      flex
      h-[83px]
      w-full
      justify-center
      bg-gradient-to-br
      from-violetRed-600
      via-violetRed-600
      to-violetRed-900
      px-4
      md:top-0
      md:bottom-[unset]
      "
    >
      <div className="min-w-4 mx-auto flex w-full max-w-7xl items-center justify-between md:justify-end md:gap-6">
        <Link
          className={clsx(
            'md:mr-auto md:inline-block md:max-h-12',
            isUser && 'hidden'
          )}
          underline="hover"
          href="/"
          title={t('GLOBAL_back_to_home')}
        >
          <LogoSVG aria-label={t('SVG_logo')} className="align-middle" />
        </Link>
        {isUser && (
          <>
            <Button
              className={`${twNavbarButton} md:hidden`}
              onClick={() => router.back()}
            >
              <ArrowBackRoundedIcon className="text-3xl" />
            </Button>
            <Button className={twNavbarButton}>
              <SearchRoundedIcon className="text-3xl" />
            </Button>
            <Button
              className={twNavbarButton}
              onClick={() => router.push('/community/dashboard')}
            >
              <GridViewRoundedIcon className="text-3xl" />
            </Button>
            <UserIcon />
          </>
        )}
      </div>
    </nav>
  )
}
export default NavigationBar
