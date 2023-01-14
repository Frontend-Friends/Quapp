import { FC, useCallback, useRef, useState } from 'react'
import {
  Button,
  Divider,
  ListItemIcon,
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
import InventoryIcon from '@mui/icons-material/Inventory'
import Link from 'next/link'

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
        <Person2RoundedIcon className="text-3xl" />
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
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuList>
          <MenuItem>
            <Link href="/user/my-list" passHref>
              <a className="flex items-center no-underline hover:text-secondary focus:text-secondary">
                <ListItemIcon>
                  <InventoryIcon fontSize="small" />
                </ListItemIcon>
                {t('PRODUCTS_my_list')}
              </a>
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem>
            <Link href="/user/account-settings" passHref>
              <a className="flex items-center no-underline hover:text-secondary focus:text-secondary">
                <ListItemIcon>
                  <SettingsRounded fontSize="small" />
                </ListItemIcon>
                {t('GLOBAL_go_to_account_settings')}
              </a>
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem>
            <Link href="/user/inbox" passHref>
              <a className="flex items-center no-underline hover:text-secondary focus:text-secondary">
                <ListItemIcon>
                  <SettingsRounded fontSize="small" />
                </ListItemIcon>
                {t('GLOBAL_go_to_inbox')}
              </a>
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem>
            <button
              onClick={handleLogout}
              className="flex items-center border-0 bg-transparent p-0 no-underline hover:text-secondary focus:text-secondary"
            >
              <ListItemIcon>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              {t('LOGOUT_logout')}
            </button>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
