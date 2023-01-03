export const getQueryAsNumber = (query?: string | string[]) => {
  if (typeof query !== 'string') {
    return 0
  }
  // Find any non Digit except comma and decimal
  const mayHasLetters = query.match(/[^\d\n,.]/g)
  const mayHasCommas = query.match(/,/g)
  const mayHasDecimal = query.match(/\./g)

  const toManyCommas = mayHasCommas && mayHasCommas.length > 1
  const toManyDecimal = mayHasDecimal && mayHasDecimal.length > 1

  if (mayHasLetters || toManyDecimal || toManyCommas) {
    return 0
  }
  const commaToDecimal = query.replace(',', '.')

  return isNaN(parseFloat(commaToDecimal)) ? 0 : parseFloat(commaToDecimal)
}
