export const deleteObjectKey = <
  T extends Record<string, unknown>,
  P extends keyof T
>(
  obj: T,
  key: P
) => {
  delete obj[key]
}
