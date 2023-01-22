import { useState } from 'react'
import { sendFormData } from '../lib/helpers/send-form-data'
import { InvitationType } from '../components/products/types'
import { useTranslation } from './use-translation'
import { useSnackbar } from './use-snackbar'

export const useHandleInvitation = (spaceId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const t = useTranslation()
  const setAlert = useSnackbar((state) => state.setAlert)

  const handleInvitation = async (values: InvitationType) => {
    setIsLoading(true)
    try {
      const invitation = await sendFormData<{
        isInvitationOk: boolean
        message: string
      }>('/api/invitation', { ...values, space: spaceId })
      if (invitation.ok) {
        setAlert({ severity: 'success', children: t(invitation.message) })
        setOpenModal(false)
      } else {
        setAlert({ severity: 'error', children: t('INVITATION_server_error') })
      }
    } catch {
      setAlert({ severity: 'error', children: t('INVITATION_server_error') })
    }
    setIsLoading(false)
  }

  return { isLoading, setAlert, openModal, setOpenModal, handleInvitation }
}
