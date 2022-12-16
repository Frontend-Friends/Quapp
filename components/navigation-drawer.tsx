import { Box, Drawer, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import { FC, KeyboardEvent, MouseEvent } from 'react'

export type LinkProps = { href: string; label: string }

export const NavigationDrawer: FC<{
  list: LinkProps[]
  state: boolean
  toggleState: (event: KeyboardEvent | MouseEvent) => void
}> = ({ list, state, toggleState }) => {
  return (
    <Drawer
      anchor="left"
      open={state}
      onClose={toggleState}
      PaperProps={{
        sx: { minWidth: '240px' },
      }}
    >
      <Box py={2} px={4} className="grid gap-1">
        {list.map((item, index) => (
          <Link href={item.href} passHref key={index}>
            <MuiLink underline="none">{item.label}</MuiLink>
          </Link>
        ))}
      </Box>
    </Drawer>
  )
}
