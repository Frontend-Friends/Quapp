import { object, string } from 'yup'

export const settingsFormSchema = object().shape({
  firstName: string().min(2, 'too short').required('Required field'),
  lastName: string().min(1, 'too short').required('Required field'),
  phone: string().min(2, 'too short').required('Required field'),
})
