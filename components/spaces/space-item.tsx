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
import { fetchJson } from '../../lib/helpers/fetch-json'

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

  const handleDeleteClick = async () => {
    handleClose()
    await fetchJson(`/api/delete-space?spaceId=${space.id}`)
    await fetchJson(`/api/delete-space-from-user?spaceId=${space.id}`)
  }

  const handleEditClick = () => {}

  const t = useTranslation()

  return (
    <Grid item xs={1} className="grow">
      <Card
        variant="outlined"
        className="relative w-full text-left hover:bg-slate-100"
        color="inherit"
      >
        <Link href={`${space.id}/products`} passHref>
          <MuiLink
            title={`${t('GLOBAL_open')} ${space.name}`}
            className="absolute top-0 bottom-0 left-0 right-0 block"
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
              className="relative"
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
          <MenuItem onClick={handleEditClick}>{t('GLOBAL_edit')}</MenuItem>
          <MenuItem onClick={handleDeleteClick}>{t('GLOBAL_delete')}</MenuItem>
        </Menu>
        <CardContent className="flex items-center">
          {space.memberCount && (
            <Typography
              align="justify"
              variant="body2"
              className="mr-6 flex items-center"
            >
              <GroupsIcon className="mr-2" />
              {space.memberCount}
            </Typography>
          )}
          {space.itemCount && (
            <Typography
              align="justify"
              variant="body2"
              className="mr-6 flex items-center"
            >
              <CategoryIcon className="mr-2" /> {space.itemCount}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}

export default SpaceItem
