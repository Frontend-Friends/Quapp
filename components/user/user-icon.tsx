import { useCallback, useRef, FC, useState } from 'react'
import { Button, Divider, ListItemText, MenuList } from '@mui/material'
import { useTranslation } from '../../hooks/use-translation'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useRouter } from 'next/router'
import { twNavbarButton } from '../navigation/navigation-bar'
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded'
import { LogoutRounded, SettingsRounded } from '@mui/icons-material'
import ListItemIcon from '@mui/material/ListItemIcon'

const UserIcon: FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const ref = useRef<HTMLButtonElement | null>(null)
  const handleClick = () => {
    setOpen(!open)
  }
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    const result = await fetchJson<{ isLoggedOut: boolean }>('/api/logout')
    if (result.isLoggedOut) {
      await router.push('/auth/login')
    }
  }, [router])

  const t = useTranslation()
  return (
    <>
      <Button
        className={twNavbarButton}
        ref={ref}
        onClick={() => {
          setAnchorEl(ref.current)
          setOpen(true)
        }}
      >
        <Person2RoundedIcon fontSize="large" />
      </Button>
      <Menu
        id="basic-menu"
        open={open}
        onClose={() => setOpen(false)}
        onClick={handleClick}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuList>
          <MenuItem
            onClick={async () => {
              setOpen(false)
              await router.push('/user/account-settings')
            }}
          >
            <ListItemIcon>
              <SettingsRounded fontSize="small" />
            </ListItemIcon>
            {t('GLOBAL_go_to_account_settings')}
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={async () => {
              setOpen(false)
              await handleLogout()
            }}
          >
            <ListItemIcon>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('LOGOUT_logout')}</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default UserIcon
