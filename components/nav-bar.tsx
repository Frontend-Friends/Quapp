import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { FC, FormEvent, KeyboardEvent, MouseEvent, useState } from 'react'
import { LinkProps, NavigationDrawer } from './navigation-drawer'
import { useTranslation } from '../hooks/use-translation'
import { fetchJson } from '../lib/helpers/fetch-json'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const NavBar: FC<{
  linkList: LinkProps[]
  isLoggedIn: boolean | undefined
}> = ({ linkList, isLoggedIn }) => {
  const [drawerState, setDrawerState] = useState(false)
  const t = useTranslation()
  const router = useRouter()

  const toggleDrawer = (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' ||
        (event as KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setDrawerState(!drawerState)
  }

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault()

    const result = await fetchJson(' /api/logout')

    if (result.ok) {
      await router.push('/auth/login')
    }
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            className="mr-4"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" className="grow">
            QUAPP
          </Typography>

          {isLoggedIn ? (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleLogout}
            >
              {t('LOGOUT_logout')}
            </Button>
          ) : (
            <Link href="/auth/login" passHref>
              <Button color="secondary" variant="contained">
                {t('LOGIN_login')}
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <NavigationDrawer
        list={linkList}
        state={drawerState}
        toggleState={toggleDrawer}
      />
    </>
  )
}
