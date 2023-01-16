import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import React, { FC, useEffect, useState } from 'react'
import { Badge, Button, Link } from '@mui/material'
import { useRouter } from 'next/router'
import { LogoSVG } from '../svg/quapp_logo'
import { UserIcon } from '../user/user-icon'
import { useTranslation } from '../../hooks/use-translation'
import { fetchJson } from '../../lib/helpers/fetch-json'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import { useUnreadMessages } from '../../hooks/use-unread-messages'

const userExists = async () => {
  const user: { isUser: boolean } = await fetchJson(' /api/cookie')
  return user.isUser
}
export const twNavbarButton =
  'aspect-square min-w-0 border-0 rounded-full bg-white text-violetRed-600 hover:bg-white md:min-w-[32px]'
const NavigationBar: FC = () => {
  const t = useTranslation()
  const [isUser, setIsUser] = useState(false)
  const { asPath } = useRouter()
  const { messages } = useUnreadMessages()

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
      h-[63px]
      w-full
      justify-center
      bg-gradient-to-br
      from-violetRed-600
      via-violetRed-600
      to-violetRed-900
      px-4
      md:top-0
      md:bottom-[unset]
      md:h-[83px]
      "
    >
      <div
        className="
          min-w-4mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-between
          md:justify-end
          md:gap-6"
      >
        <Link
          className="md:mr-auto md:inline-block md:max-h-12"
          underline="hover"
          href="/"
          title={t('GLOBAL_back_to_home')}
        >
          <LogoSVG
            preserveAspectRatio="xMinYMin meet"
            aria-label={t('SVG_logo')}
            className="align-middle"
          />
        </Link>
        {isUser && (
          <>
            <Button
              className={twNavbarButton}
              onClick={() => router.push('/community/dashboard')}
            >
              <GridViewRoundedIcon className="text-3xl" />
            </Button>
            <Button
              aria-label={t('GLOBAL_go_to_inbox')}
              className={twNavbarButton}
              onClick={() => router.push('/user/inbox')}
            >
              <Badge
                badgeContent={messages.length || undefined}
                color="secondary"
              >
                <NotificationsRoundedIcon className="text-3xl" />
              </Badge>
            </Button>
            <UserIcon />
          </>
        )}
      </div>
    </nav>
  )
}
export default NavigationBar
