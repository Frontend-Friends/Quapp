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
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import { SpaceItemTypeWithUser } from '../products/types'
import GroupsIcon from '@mui/icons-material/Groups'
import CategoryIcon from '@mui/icons-material/Category'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useSnackbar } from '../../hooks/use-snackbar'
import { InvitationModal } from '../invitation-modal'
import { useHandleInvitation } from '../../hooks/useHandleInvitation'

interface Props {
  space: SpaceItemTypeWithUser
  setSpace: Dispatch<SetStateAction<SpaceItemTypeWithUser>>
  setMySpaces: Dispatch<SetStateAction<SpaceItemTypeWithUser[]>>
  mySpaces: SpaceItemTypeWithUser[]
  setOpenEditModal: Dispatch<SetStateAction<boolean>>
  setOpenMembers: Dispatch<SetStateAction<boolean>>
  setIsOwner: Dispatch<SetStateAction<boolean>>
  isOwner: boolean
  userId?: string
}

const SpaceItem: FC<Props> = ({
  space,
  setSpace,
  setIsOwner,
  setMySpaces,
  mySpaces,
  setOpenEditModal,
  setOpenMembers,
  isOwner,
  userId,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const t = useTranslation()
  const setAlert = useSnackbar((state) => state.setAlert)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    []
  )
  const handleClose = useCallback(() => {
    setAnchorEl(null)
    setDialogOpen(false)
  }, [])
  const handleEditClick = useCallback(() => {
    handleClose()
    setOpenEditModal(true)
    setSpace(space)
  }, [handleClose, setOpenEditModal, setSpace, space])

  const handleLeaveSpace = async () => {
    try {
      await fetchJson(`/api/remove-member?space=${space.id}&userId=${userId}`, {
        method: 'DELETE',
      })

      setMySpaces((prevState) =>
        prevState.filter((mySpace) => mySpace.id !== space.id)
      )
      setAlert({
        severity: 'success',
        children: t('SUCCESSFULLY_REMOVED_MEMBER'),
      })
    } catch (error) {
      setAlert({ severity: 'error', children: t('RESPONSE_SERVER_ERROR') })
    }
  }

  const handleLeaveClick = async () => {
    handleClose()
    await handleLeaveSpace()
  }

  const onMemberClick = useCallback(() => {
    setSpace(space)
    setIsOwner(isOwner)
    setOpenMembers(true)
    handleClose()
  }, [isOwner, space, setIsOwner, setSpace, setOpenMembers, handleClose])

  const handleDeleteClick = async () => {
    handleClose()
    try {
      const delSpace = await fetchJson<{
        ok: boolean
        message: string
      }>(`/api/delete-space?spaceId=${space.id}`)

      if (delSpace.ok) {
        setAlert({ severity: 'success', children: delSpace.message })
        setMySpaces(
          mySpaces.filter(
            (mySpace) => mySpace.creationDate !== space.creationDate
          )
        )
      } else {
        setAlert({ severity: 'error', children: delSpace.message })
      }
    } catch (error) {
      setAlert({ severity: 'error', children: t('RESPONSE_SERVER_ERROR') })
    }
  }
  const { isLoading, openModal, setOpenModal, handleInvitation } =
    useHandleInvitation(space.id ?? '')

  return (
    <>
      <Grid item xs={1} className="basis-full">
        <Card
          variant="outlined"
          className="relative flex w-full flex-wrap bg-blueishGray-50 text-left hover:bg-blueishGray-100 md:p-2"
        >
          <Link href={`${space.id}/products`} passHref>
            <MuiLink
              title={`${space.name} ${t('GLOBAL_open')}`}
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
            disableScrollLock={true}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {isOwner && [
              <MenuItem onClick={() => handleEditClick()} key="owner-item-1">
                {t('GLOBAL_edit')}
              </MenuItem>,
              <MenuItem onClick={() => setDialogOpen(true)} key="owner-item-2">
                {t('GLOBAL_delete')}
              </MenuItem>,
            ]}
            <MenuItem
              onClick={() => {
                setOpenModal(true)
                handleClose()
              }}
              key="owner-item-3"
            >
              {t('MENU_invite_member')}
            </MenuItem>
            <MenuItem onClick={onMemberClick} key="owner-item-4">
              {t('GLOBAL_members')}
            </MenuItem>
            <MenuItem onClick={() => handleLeaveClick()} key="owner-item-5">
              {t('GLOBAL_leave_space')}
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
      <InvitationModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        isLoading={isLoading}
        handleInvitation={handleInvitation}
      />
    </>
  )
}

export default SpaceItem
