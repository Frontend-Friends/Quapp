import { Box, Drawer, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import { FC, KeyboardEvent, MouseEvent } from 'react'

export const NavigationDrawer: FC<{
  list: { href: string; label: string }[]
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
      <Box py={2} px={4} sx={{ display: 'grid', gap: '4px' }}>
        {list.map((item, index) => (
          <Link href={item.href} passHref key={index}>
            <MuiLink underline="none">{item.label}</MuiLink>
          </Link>
        ))}
      </Box>
    </Drawer>
  )
}
