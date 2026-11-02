export const setLS = (name: string, data: unknown) => {
  try {
    localStorage.setItem(name, JSON.stringify(data))
  } catch {
    /* Cache is optional. */
  }
}
export const getLS = (name: string) => {
  try {
    return JSON.parse(localStorage.getItem(name) || 'null')
  } catch {
    return null
  }
}
