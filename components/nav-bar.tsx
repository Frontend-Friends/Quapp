import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { FC, KeyboardEvent, MouseEvent, useState } from 'react'
import { LinkProps, NavigationDrawer } from './navigation-drawer'

export const NavBar: FC<{ linkList: LinkProps[] }> = ({ linkList }) => {
  const [drawerState, setDrawerState] = useState(false)

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

          <Button
            href="login"
            component="a"
            LinkComponent={Link}
            color="secondary"
            variant="contained"
          >
            Login
          </Button>
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
