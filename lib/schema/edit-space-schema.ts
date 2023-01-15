import { object, string } from 'yup'

export const editSpaceSchema = object().shape({
  name: string().min(2, 'too short').required('Required field'),
  ownerId: string().min(1, 'too short').required('Required field'),
})
