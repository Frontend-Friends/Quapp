import { object, string } from 'yup'

export const signupFormSchema = object().shape({
  firstName: string().min(2, 'GLOBAL_too_short').required('GLOBAL_required'),
  email: string().email().required('GLOBAL_required'),
  password: string()
    .min(8, 'GLOBAL_password_min_eight')
    .required('GLOBAL_required'),
})
