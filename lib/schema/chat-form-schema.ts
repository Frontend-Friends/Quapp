import { object, string } from 'yup'

export const chatFormSchema = object().shape({
  message: string()
    .min(2, 'CHAT_message_error')
    .required('CHAT_message_required'),
})
