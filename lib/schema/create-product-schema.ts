import { mixed, object, string } from 'yup'

export const createProductSchema = object().shape({
  title: string().min(4, 'to short').required('Required'),
  text: string().min(4, 'to short').required('Required'),
  lead: string(),
  img: mixed(),
  description: string(),
})
