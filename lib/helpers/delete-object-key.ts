export const deleteObjectKey = <T extends Record<string, unknown>>(
  obj: T,
  ...keys: (keyof T)[]
) => {
  keys.forEach((key) => {
    delete obj[key]
  })
}
