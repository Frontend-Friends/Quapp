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
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'

export const UserIcon: FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const ref = useRef<HTMLButtonElement | null>(null)
  const t = useTranslation()
  const { push } = useRouter()

  const handleClick = useCallback(() => {
    setOpen((state) => !state)
  }, [])
  const handleLogout = useCallback(async () => {
    const result = await fetchJson('/api/logout')
    if (result.ok) {
      await push('/auth/login')
    }
  }, [push])

  return (
    <div>
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
            onClick={() => {
              push('/user/account-settings')
            }}
          >
            <ListItemIcon>
              <SettingsRounded fontSize="small" />
            </ListItemIcon>
            {t('GLOBAL_go_to_account_settings')}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('LOGOUT_logout')}</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
