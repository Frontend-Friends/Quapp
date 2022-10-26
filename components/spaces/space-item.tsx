import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
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

  return (
    <Grid item xs={2} sx={{ flexGrow: '1' }}>
      <Card variant="outlined">
        <CardActionArea disableRipple>
          <CardHeader
            title={space.name}
            action={
              <IconButton
                aria-label="settings"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
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
            <MenuItem onClick={handleClose}>Bearbeiten</MenuItem>
            <MenuItem onClick={handleClose}>Löschen</MenuItem>
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
                <GroupsIcon sx={{ mr: 1 }} /> {space.memberCount}
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
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default SpaceItem
