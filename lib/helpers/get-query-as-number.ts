export const getQueryAsNumber = (query?: string | string[]) =>
  isNaN(parseInt(query as string)) ? 0 : parseInt(query as string)
