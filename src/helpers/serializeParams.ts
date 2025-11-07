const serializeParams = (params: Record<string, string | string[]>) => {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        searchParams.append(key, v)
      }
    } else if (value != null) {
      searchParams.append(key, value)
    }
  }
  return searchParams.toString()
}

export default serializeParams
