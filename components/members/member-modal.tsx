import { SpaceItemTypeWithUser } from '../products/types'
import { useTranslation } from '../../hooks/use-translation'
import { List, ListItem, Modal } from '@mui/material'
import { CondensedContainer } from '../condensed-container'
import clsx from 'clsx'
import React from 'react'

export const MembersModal = ({
  members,
  open,
  onClose,
}: {
  members?: Pick<SpaceItemTypeWithUser, 'enhancedUsersInSpace' | 'id'>
  open: boolean
  onClose: () => void
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
        <h3 id="invitation-title">{`${t('GLOBAL_members')} `}</h3>
        <List>
          {members?.enhancedUsersInSpace?.map((member, index) => (
            <ListItem
              key={index}
              className={clsx(
                'border-0 border-b border-solid border-gray-300',
                index === 0 && 'border-t'
              )}
            >
              {member.userName}
            </ListItem>
          ))}
        </List>
      </CondensedContainer>
    </Modal>
  )
}
