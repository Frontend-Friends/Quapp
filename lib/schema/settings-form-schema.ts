import { object, string } from 'yup'

export const settingsFormSchema = object().shape({
  firstName: string().min(2, 'GLOBAL_too_short').required('GLOBAL_required'),
  lastName: string().min(1, 'GLOBAL_too_short').required('GLOBAL_required'),
  userName: string().min(1, 'GLOBAL_too_short').required('GLOBAL_required'),
  phone: string().min(2, 'GLOBAL_too_short').required('GLOBAL_required'),
})
