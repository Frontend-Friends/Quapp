import React, { useRef } from 'react'
import { Button } from '@mui/material'
import { useTranslation } from '../../hooks/use-translation'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useRouter } from 'next/router'

const UserIcon: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const ref = useRef<HTMLButtonElement | null>(null)
  const handleClick = () => {
    setOpen(!open)
  }
  const router = useRouter()

  const handleLogout = async () => {
    const result = await fetchJson<{ isLoggedOut: boolean }>('/api/logout')
    if (result.isLoggedOut) {
      await router.push('/auth/login')
    }
  }

  const t = useTranslation()
  return (
    <>
      <Button
        ref={ref}
        onClick={() => {
          setAnchorEl(ref.current)
          setOpen(true)
        }}
      >
        {t('GLOBAL_settings')}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setOpen(false)}
        onClick={handleClick}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        // anchorOrigin={{
        //   vertical: 'top',
        //   horizontal: 'right',
        // }}
      >
        <MenuItem
          onClick={async () => {
            setOpen(false)
            await router.push('/user/account-settings')
          }}
        >
          {t('GLOBAL_go_to_account_settings')}
        </MenuItem>
        <MenuItem
          onClick={async () => {
            setOpen(false)
            await handleLogout()
          }}
        >
          {t('LOGOUT_logout')}
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserIcon
