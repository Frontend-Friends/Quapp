export const fetchJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  return fetch(input, init)
    .then((r) => r.json())
    .then((r) => r as T)
}
