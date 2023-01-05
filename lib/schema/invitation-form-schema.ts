import { object, string } from 'yup'

export const invitationFormSchema = object().shape({
  email: string().required('Required').email('Invalid email'),
  firstName: string().min(1, 'too short').required('Required'),
})
