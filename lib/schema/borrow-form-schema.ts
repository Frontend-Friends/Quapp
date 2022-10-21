import { date, object, string } from 'yup'

export const borrowFormSchema = object().shape({
  message: string().min(1, 'to short').required('Required'),
  borrowDate: date().required('Required'),
})
