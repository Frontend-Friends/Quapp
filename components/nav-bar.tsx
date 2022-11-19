import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { FC, FormEvent, KeyboardEvent, MouseEvent, useState } from 'react'
import { LinkProps, NavigationDrawer } from './navigation-drawer'
import { useTranslation } from '../hooks/use-translation'
import { useLocation } from 'react-use'
import { fetchJson } from '../lib/helpers/fetch-json'
import { useRouter } from 'next/router'

export const NavBar: FC<{ linkList: LinkProps[]; isLoggedIn: boolean }> = ({
  linkList,
  isLoggedIn,
}) => {
  const [drawerState, setDrawerState] = useState(false)
  const [isLoggedOut, setIsLoggedOut] = useState(!isLoggedIn)
  const t = useTranslation()
  const location = useLocation()
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

    const result = await fetchJson<{ isLoggedOut: boolean }>(' /api/logout')

    if (result.isLoggedOut) {
      setIsLoggedOut(true)
      await router.push('/login')
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
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QUAPP
          </Typography>

          {location.pathname !== '/login' &&
            // (isLoggedOut ? (
            //   <Button color="secondary" variant="contained">
            //     {t('LOGIN_login')}
            //   </Button>
            // ) : (
            //   <Button
            //     color="secondary"
            //     variant="contained"
            //     onClick={handleLogout}
            //   >
            //     {t('LOGOUT_logout')}
            //   </Button>
            // )
            null}
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
