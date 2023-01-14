import { object, string } from 'yup'

export const invitationFormSchema = object().shape({
  email: string().required('GLOBAL_required').email('GLOBAL_invalid_email'),
  firstName: string().min(1, 'GLOBAL_too_short').required('GLOBAL_required'),
})
