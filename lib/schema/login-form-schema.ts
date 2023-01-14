import { object, string } from 'yup'

export const loginFormSchema = object().shape({
  email: string().min(1, 'GLOBAL_too_short').required('GLOBAL_required'),
  password: string().min(1, 'GLOBAL_too_short').required('GLOBAL_required'),
})
