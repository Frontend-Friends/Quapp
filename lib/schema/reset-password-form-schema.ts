import { object, string } from 'yup'

export const resetPasswordFormSchema = object().shape({
  email: string()
    .min(1, 'too short')
    .required('Required')
    .email('Invalid email'),
})
