import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useState, KeyboardEvent, MouseEvent } from 'react'
import Link from 'next/link'
import { NavigationDrawer } from '../navigation/navigation-drawer'
import { Navigation } from '../../mock/navigation'

export const NavBar = () => {
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
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <NavigationDrawer
        list={Navigation}
        state={drawerState}
        toggleState={toggleDrawer}
      />
    </>
  )
}
