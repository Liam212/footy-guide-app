function isNumeric(value: string | number): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value)
  }

  if (typeof value === 'string') {
    if (value.trim() === '') return false
    return !isNaN(Number(value))
  }

  return false
}

export default isNumeric
