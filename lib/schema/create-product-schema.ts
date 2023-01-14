import { boolean, mixed, object, string } from 'yup'
import { MAX_FILE_SIZE } from '../constants'

export const createProductSchema = object().shape({
  title: string().min(4, 'to short').required('PRODUCT_CREATE_required_title'),
  text: string().min(4, 'to short').required('PRODUCT_CREATE_required_text'),
  img: mixed()
    .test({
      message: 'PRODUCT_CREATE_wrong_file_format',
      test: (file, context) => {
        if (!file) {
          return true
        }
        const isValid = file?.type.match(/(png)|(jpg)|(jpeg)/g)?.length
        if (!isValid) context?.createError()
        return isValid
      },
    })
    .test({
      message: `PRODUCT_CREATE_file_size`,
      test: (file) => {
        if (!file) {
          return true
        }
        return file?.size < MAX_FILE_SIZE
      },
    }),
  isAvailable: boolean(),
  category: string().required('PRODUCT_CREATE_required_category'),
  newCategory: string().when('category', {
    is: (category: string) => category === 'newCategory',
    then: string().required('PRODUCT_CREATE_required_new_category'),
  }),
})
