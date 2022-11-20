import { object, string } from 'yup'

export const loginFormSchema = object().shape({
  email: string().min(1, 'too short').required('Required'),
  password: string().min(1, 'too short').required('Required'),
})
