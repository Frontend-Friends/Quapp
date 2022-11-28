export const fetchJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  return fetch(input, init)
    .then((r) => r.json())
    .then((r) => {
      // console.log(r, 'result from fetchJson')
      return r as T
    })
}
