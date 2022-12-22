import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded'
import { FC } from 'react'
import { LogoSVG } from '../svg/quapp_logo'
import { useRouter } from 'next/router'

const NavigationBar: FC = () => {
  const twNavbarButtons =
    'aspect-square border-0 rounded-full bg-white text-violetRed-600 active:shadow-[inset_3px_3px_3px_rgba(215,0,100,0.2)]'
  const twIcons = 'active:relative active:top-px active:left-px'
  const router = useRouter()

  return (
    <nav
      className="
      fixed
      bottom-0
      z-50
      flex
      w-full
      items-center
      justify-around
      bg-gradient-to-br
      from-violetRed-600
      via-violetRed-600
      to-violetRed-900
      p-4
      "
    >
      <button className={twNavbarButtons} onClick={() => router.back()}>
        <ArrowBackRoundedIcon fontSize="large" className={twIcons} />
      </button>
      <button className={twNavbarButtons}>
        <SearchRoundedIcon fontSize="large" className={twIcons} />
      </button>
      <button
        className={twNavbarButtons}
        onClick={() => router.push('/community/dashboard')}
      >
        <HomeRoundedIcon fontSize="large" className={twIcons} />
      </button>
      <LogoSVG aria-labelledby="logoTitle" className="max-h-10 w-1/5" />
      <button className={twNavbarButtons}>
        <Person2RoundedIcon fontSize="large" className={twIcons} />
      </button>
    </nav>
  )
}
export default NavigationBar
