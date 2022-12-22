import { boolean, mixed, object, string } from 'yup'

export const createProductSchema = object().shape({
  title: string().min(4, 'to short').required('PRODUCT_CREATE_required_title'),
  text: string().min(4, 'to short').required('PRODUCT_CREATE_required_textt'),
  img: mixed(),
  isAvailable: boolean(),
  category: string().required('PRODUCT_CREATE_required_category'),
  newCategory: string().when('category', {
    is: (category: string) => category === 'newCategory',
    then: string().required('PRODUCT_CREATE_required_new_category'),
  }),
})
