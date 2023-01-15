import { object, string } from 'yup'

export const addSpaceFormSchema = object().shape({
  name: string().min(1, 'GLOBAL_too_short').required('GLOBAL_required'),
})
