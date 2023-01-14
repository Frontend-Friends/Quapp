import { date, object, string } from 'yup'

export const borrowFormSchema = object().shape({
  message: string().min(1, 'GLOBAL_too_short').required('GLOBAL_required'),
  borrowDate: date().required('GLOBAL_required'),
})
