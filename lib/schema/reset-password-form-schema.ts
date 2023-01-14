import { object, string } from 'yup'

export const resetPasswordFormSchema = object().shape({
  email: string()
    .min(1, 'GLOBAL_too_short')
    .required('GLOBAL_required')
    .email('GLOBAL_invalid_email'),
})
