import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import React, { FC } from 'react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { LogoSVG } from '../svg/quapp_logo'

export const twNavbarButton =
  'aspect-square border-0 rounded-full bg-white text-violetRed-600 hover:bg-white md:min-w-[32px]'
const NavigationBar: FC = () => {
  const router = useRouter()

  return (
    <nav
      className="
      fixed
      bottom-0
      z-50
      w-full
      bg-gradient-to-br
      from-violetRed-600
      via-violetRed-600
      to-violetRed-900
      p-4
      md:top-0
      md:bottom-[unset]
      "
    >
      <div className="min-w-4 mx-auto flex max-w-7xl items-center justify-around md:justify-end md:gap-6">
        <LogoSVG
          aria-labelledby="logoTitle"
          className="hidden md:mr-auto md:inline-block md:max-h-12"
        />
        <Button
          className={`${twNavbarButton} md:hidden`}
          onClick={() => router.back()}
        >
          <ArrowBackRoundedIcon fontSize="large" />
        </Button>
        <Button className={twNavbarButton}>
          <SearchRoundedIcon fontSize="large" />
        </Button>
        <Button
          className={twNavbarButton}
          onClick={() => router.push('/community/dashboard')}
        >
          <HomeRoundedIcon fontSize="large" />
        </Button>
      </div>
    </nav>
  )
}
export default NavigationBar
