import { object, string } from 'yup'

export const signupFormSchema = object().shape({
  firstName: string().min(2, 'too short').required('Required field'),
  email: string().email().required('Required field'),
  password: string()
    .min(8, 'Password is too short. Must be at least 8 characters long')
    .required('Required'),
})
