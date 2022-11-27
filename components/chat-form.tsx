import { ChatMessage } from './products/types'
import { useTranslation } from '../hooks/use-translation'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import { sendFormData } from '../lib/helpers/send-form-data'
import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { chatFormSchema } from '../lib/schema/chat-form-schema'

export const ChatForm = ({
  isOwner,
  chatId,
  setChat,
}: {
  isOwner: boolean
  chatId: string
  setChat?: (chat: ChatMessage[]) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslation()
  const { query } = useRouter()
  const [productId] = query.products as string[]
  return (
    <Formik
      validationSchema={chatFormSchema}
      initialValues={{ message: '' }}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={async (values, { resetForm, setSubmitting, setValues }) => {
        setIsLoading(true)
        const result = await sendFormData<{
          isOk: boolean
          history: ChatMessage[]
        }>(`/api/send-chat?space=${query.space}`, {
          productId,
          chatId,
          fromOwner: isOwner,
          ...values,
        })
        if (result.isOk && setChat) {
          setValues({ message: '' })
          setSubmitting(false)
          resetForm({ values: { message: '' } })
          setChat(result.history)
        }
        setIsLoading(false)
      }}
    >
      {({ values, handleSubmit, handleBlur, handleChange, errors }) => (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
          <TextField
            label={t('CHAT_message')}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            name="message"
            error={!!errors.message}
            helperText={errors.message ? t(errors.message) : ''}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isLoading || !values.message}
          >
            {isLoading ? t('CHAT_button_loading') : t('CHAT_button_send')}
          </Button>
        </form>
      )}
    </Formik>
  )
}
