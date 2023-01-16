import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  Link as MuiLink,
  Typography,
} from '@mui/material'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { SpaceItemType } from '../products/types'
import GroupsIcon from '@mui/icons-material/Groups'
import CategoryIcon from '@mui/icons-material/Category'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { fetchJson } from '../../lib/helpers/fetch-json'

interface Props {
  space: SpaceItemType
  setMySpaces: Dispatch<SetStateAction<SpaceItemType[]>>
  mySpaces: SpaceItemType[]
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>
  setMessage: Dispatch<SetStateAction<string>>
}

const SpaceItem: FC<Props> = ({
  space,
  setMySpaces,
  mySpaces,
  setSnackbarOpen,
  setMessage,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setDialogOpen(false)
    setSnackbarOpen(false)
  }
  const handleDeleteClick = async () => {
    handleClose()
    try {
      const delSpace = await fetchJson<{
        ok: boolean
        message: string
      }>(`/api/delete-space?spaceId=${space.id}`)

      const delSpaceFromUser = await fetchJson<{
        ok: boolean
        message: string
      }>(`/api/delete-space-from-user?spaceId=${space.id}`)
      const allSuccess = await Promise.all([delSpace, delSpaceFromUser])
      if (allSuccess) {
        setMessage(delSpace.message)
        setSnackbarOpen(true)
        setMySpaces(
          mySpaces.filter(
            (mySpace) => mySpace.creationDate !== space.creationDate
          )
        )
      } else {
        setMessage(delSpace.message)
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditClick = () => {}

  const t = useTranslation()

  return (
    <>
      <Grid item xs={1} className="basis-full">
        <Card
          variant="outlined"
          className="relative flex w-full flex-wrap bg-blueishGray-50 text-left hover:bg-blueishGray-100 md:p-2"
        >
          <Link href={`${space.id}/products`} passHref>
            <MuiLink
              title={`${t('GLOBAL_open')} ${space.name}`}
              className="absolute top-0 bottom-0 left-0 right-0 block"
            />
          </Link>
          <CardHeader
            title={space.name}
            className="grow pb-2"
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
            <MenuItem onClick={() => setDialogOpen(true)}>
              {t('GLOBAL_delete')}
            </MenuItem>
          </Menu>
          <CardContent className="flex basis-full items-center pt-2">
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
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{t('DELETE_text')}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteClick}>{t('GLOBAL_yes')}</Button>
          <Button onClick={handleClose} autoFocus>
            {t('GLOBAL_no')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SpaceItem
