import { fetchJson } from './fetch-json'
import { FormikValues } from 'formik'

export const sendFormData = async <P, T extends FormikValues = FormikValues>(
  input: RequestInfo | URL,
  values: T
) => {
  const data = new FormData()

  Object.entries(values).forEach(([key, value]) => {
    if (value) data.append(key, value as string | Blob)
  })
  return fetchJson<P>(input, {
    method: 'POST',
    body: data,
  })
}
