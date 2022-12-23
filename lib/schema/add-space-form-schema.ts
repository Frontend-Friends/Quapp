import { object, string } from 'yup'

export const addSpaceFormSchema = object().shape({
  name: string().min(1, 'to short').required('Required'),
})
