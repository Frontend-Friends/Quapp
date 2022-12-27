import { FC, useCallback, useRef, useState } from 'react'
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material'
import { twNavbarButton } from '../navigation/navigation-bar'
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded'
import { useRouter } from 'next/router'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useTranslation } from '../../hooks/use-translation'
import { LogoutRounded, SettingsRounded } from '@mui/icons-material'

const UserIcon: FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const ref = useRef<HTMLButtonElement | null>(null)
  const handleClick = () => {
    setOpen((state) => !state)
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
        onClick={() => handleClick()}
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
            onClick={() => {
              router.push('/user/account-settings')
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
