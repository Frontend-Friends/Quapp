import { getQueryAsNumber } from '../lib/helpers/get-query-as-number'

describe('getQueryAsNumber', () => {
  it('returns 0 from undefined', () => {
    expect(getQueryAsNumber()).toBe(0)
  })

  it('returns 0 from a non digit string', () => {
    expect(getQueryAsNumber('hello')).toBe(0)
  })

  it('returns a number from a digit string', () => {
    expect(getQueryAsNumber('12')).toBe(12)
    expect(getQueryAsNumber('300')).toBe(300)
    expect(getQueryAsNumber('0.300')).toBe(0.3)
    expect(getQueryAsNumber('0,678900')).toBe(0.6789)
  })

  it('returns 0 from a wrong digit string', () => {
    expect(getQueryAsNumber('12f')).toBe(0)
    expect(getQueryAsNumber('30,,0')).toBe(0)
    expect(getQueryAsNumber('0.3.00')).toBe(0)
    expect(getQueryAsNumber('0,678,900')).toBe(0)
    expect(getQueryAsNumber('0,678,fda')).toBe(0)
  })
})
