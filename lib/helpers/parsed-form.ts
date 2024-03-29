import formidable from 'formidable'
import { NextApiRequest } from 'next'
import { FormikValues } from 'formik'

export const parsedForm = async <
  T extends {
    fields: Record<string, unknown>
    files?: Record<string, unknown> | null
  }
>(
  req: NextApiRequest
) => {
  const form = new formidable.IncomingForm()

  const formResult = await new Promise<FormikValues>((resolve, reject) =>
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err)
      resolve({
        fields,
        files,
      })
    })
  )
  const normalizeFields = Object.entries(formResult.fields).reduce(
    (acc, [key, value]) => {
      if (value === 'true') {
        acc[`${key}`] = true
      } else if (value === 'false') {
        acc[`${key}`] = false
      } else {
        acc[`${key}`] = value as string
      }
      return acc
    },
    {} as Record<string, string | boolean>
  )
  return { fields: normalizeFields, files: formResult.files } as unknown as T
}
