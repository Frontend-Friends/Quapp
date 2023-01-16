import { FC, useCallback, useRef, useState } from 'react'
import {
  Badge,
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
import EmailIcon from '@mui/icons-material/Email'
import ListAltIcon from '@mui/icons-material/ListAlt'
import Link from 'next/link'
import { useUnreadMessages } from '../../hooks/use-unread-messages'

export const UserIcon: FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const ref = useRef<HTMLButtonElement | null>(null)
  const t = useTranslation()
  const { push } = useRouter()
  const { messages } = useUnreadMessages()

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
        <Badge badgeContent={messages.length || undefined} color="secondary">
          <Person2RoundedIcon className="text-3xl" />
        </Badge>
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
          <MenuItem className="p-0 hover:bg-white">
            <Link href="/user/my-list" passHref>
              <a className="flex items-center py-2 px-6 text-current no-underline hover:text-primary focus:text-secondary">
                <ListItemIcon>
                  <ListAltIcon fontSize="small" />
                </ListItemIcon>
                {t('PRODUCTS_my_list')}
              </a>
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem className="p-0 hover:bg-white">
            <Link href="/user/account-settings" passHref>
              <a className="flex items-center py-2 px-6 text-current no-underline hover:text-primary focus:text-secondary">
                <ListItemIcon>
                  <SettingsRounded fontSize="small" />
                </ListItemIcon>
                {t('GLOBAL_go_to_account_settings')}
              </a>
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem className="p-0 hover:bg-white">
            <Link href="/user/inbox" passHref>
              <a className="flex items-center py-2 px-6 text-current no-underline hover:text-primary focus:text-secondary">
                <ListItemIcon>
                  <Badge
                    badgeContent={messages.length || undefined}
                    color="secondary"
                  >
                    <EmailIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                {t('GLOBAL_go_to_inbox')}
              </a>
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem className="hover:bg-white">
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center border-0 bg-transparent px-3 font-[Jost] text-base text-current no-underline hover:text-primary focus:text-secondary"
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
