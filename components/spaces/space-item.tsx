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
import { InvitationType, SpaceItemTypeWithUser } from '../products/types'
import GroupsIcon from '@mui/icons-material/Groups'
import CategoryIcon from '@mui/icons-material/Category'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from '../../hooks/use-translation'
import Link from 'next/link'
import { fetchJson } from '../../lib/helpers/fetch-json'
import { useSnackbar } from '../../hooks/use-snackbar'
import InvitationModal from '../../pages/community/[space]/products/invitation-modal'
import { sendFormData } from '../../lib/helpers/send-form-data'

interface Props {
  space: SpaceItemTypeWithUser
  setSpace: Dispatch<SetStateAction<SpaceItemTypeWithUser>>
  setMySpaces: Dispatch<SetStateAction<SpaceItemTypeWithUser[]>>
  mySpaces: SpaceItemTypeWithUser[]
  setOpenEditModal: Dispatch<SetStateAction<boolean>>
  setOpenMembers: Dispatch<SetStateAction<boolean>>
  setMembers: Dispatch<
    SetStateAction<
      Pick<SpaceItemTypeWithUser, 'enhancedUsersInSpace' | 'id'> | undefined
    >
  >
  isOwner: boolean
}

const SpaceItem: FC<Props> = ({
  space,
  setSpace,
  setMySpaces,
  mySpaces,
  setOpenEditModal,
  setOpenMembers,
  setMembers,
  isOwner,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
  const onMemberClick = useCallback(() => {
    setMembers({
      id: space.id,
      enhancedUsersInSpace: space.enhancedUsersInSpace,
    })
    setOpenMembers(true)
    handleClose()
  }, [
    setMembers,
    setOpenMembers,
    space.enhancedUsersInSpace,
    space.id,
    handleClose,
  ])

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
  const handleInvitation = async (values: InvitationType) => {
    setIsLoading(true)
    try {
      const invitation = await sendFormData<{
        isInvitationOk: boolean
        message: string
        ok: boolean
      }>('/api/invitation', { ...values, space: space })
      if (invitation.ok) {
        setAlert({ severity: 'success', children: invitation.message })
      } else {
        setAlert({ severity: 'error', children: invitation.message })
      }
      setOpenModal(false)
      setIsLoading(false)
    } catch {
      setAlert({ severity: 'error', children: t('INVITATION_server_error') })
      setOpenModal(true)
      setIsLoading(false)
    }
  }

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
            {isOwner && (
              <div>
                <MenuItem onClick={() => handleEditClick()}>
                  {t('GLOBAL_edit')}
                </MenuItem>
                <MenuItem onClick={() => setDialogOpen(true)}>
                  {t('GLOBAL_delete')}
                </MenuItem>
              </div>
            )}
            <MenuItem
              onClick={() => {
                setOpenModal(true)
                handleClose()
              }}
            >
              {t('MENU_invite_member')}
            </MenuItem>
            <MenuItem onClick={onMemberClick}>{t('GLOBAL_members')}</MenuItem>
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
