import { SpaceItemTypeWithUser } from '../products/types'
import { useTranslation } from '../../hooks/use-translation'
import { IconButton, List, ListItem } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import Overlay from '../overlay'

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
    <Overlay
      open={open}
      onCloseClick={onClose}
      onClose={onClose}
      containerCSS="max-w-[600px]"
    >
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
    </Overlay>
  )
}
