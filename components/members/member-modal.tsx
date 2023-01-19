import { SpaceItemTypeWithUser } from '../products/types'
import { useTranslation } from '../../hooks/use-translation'
import { Box, IconButton, List, ListItem, Modal } from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import clsx from 'clsx'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

export const MembersModal = ({
  space,
  open,
  onClose,
  onRemoveMember,
  isOwner,
}: {
  space?: SpaceItemTypeWithUser
  open: boolean
  onClose: () => void
  onRemoveMember: (params: { spaceId: string; userId: string }) => void
  isOwner: boolean
}) => {
  const t = useTranslation()
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="invitation-title"
      aria-describedby="delete-description"
    >
      <CondensedContainer className="absolute m-0 h-full max-h-full overflow-auto bg-white p-8 drop-shadow-2xl md:top-1/3 md:left-1/2 md:h-[unset] md:-translate-x-1/2 md:-translate-y-1/3">
        <Box className="sticky top-0 z-10 flex h-0 w-full justify-end">
          <IconButton
            title={t('BUTTON_close')}
            className="z-10 -mt-2 h-12 w-12 border border-slate-200 bg-white shadow hover:bg-slate-200"
            onClick={() => onClose()}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <h3 className="m-0 mb-6 pr-12" id="invitation-title">{`${t(
          'GLOBAL_members'
        )} `}</h3>
        <List>
          {space?.enhancedUsersInSpace?.map((member, index) => (
            <ListItem
              key={index}
              className={clsx(
                'justify-between border-0 border-b border-solid border-gray-300',
                index === 0 && 'border-t'
              )}
            >
              {member.userName}
              {isOwner && space.adminId !== member.id && (
                <IconButton
                  onClick={() =>
                    onRemoveMember({
                      spaceId: space.id || '',
                      userId: member.id || '',
                    })
                  }
                  title={`${member.userName} ${t('GLOBAL_remove_member')}`}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </CondensedContainer>
    </Modal>
  )
}
