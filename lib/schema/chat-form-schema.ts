import { date, object, string } from 'yup'

export const chatFormSchema = object().shape({
  message: string().min(1, 'to short').required('das feld ist leer'),
})
