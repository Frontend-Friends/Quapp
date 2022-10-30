import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Link as MuiLink,
  IconButton,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { SpaceItemType } from '../products/types'
import GroupsIcon from '@mui/icons-material/Groups'
import CategoryIcon from '@mui/icons-material/Category'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'

interface Props {
  space: SpaceItemType
}

const SpaceItem: FC<Props> = ({ space }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const t = useTranslation()

  return (
    <Grid item xs={1} sx={{ flexGrow: '1' }}>
      <Card variant="outlined" sx={{ position: 'relative' }}>
        <Link href={'#'} passHref>
          <MuiLink
            title={`${t('GLOBAL_open')} ${space.name}`}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: 'block',
            }}
          />
        </Link>
        <CardHeader
          title={space.name}
          action={
            <IconButton
              title={`${space.name} ${t('GLOBAL_options')}`}
              aria-label="settings"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{ position: 'relative' }}
            >
              <MoreVertIcon />
            </IconButton>
          }
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>{t('GLOBAL_edit')}</MenuItem>
          <MenuItem onClick={handleClose}>{t('GLOBAL_delete')}</MenuItem>
        </Menu>
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {space.memberCount && (
            <Typography
              align="justify"
              variant="body2"
              sx={{
                mr: 3,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <GroupsIcon sx={{ mr: 1 }} />
              {space.memberCount}
            </Typography>
          )}
          {space.itemCount && (
            <Typography
              align="justify"
              variant="body2"
              sx={{
                mr: 3,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CategoryIcon sx={{ mr: 1 }} /> {space.itemCount}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}

export default SpaceItem
