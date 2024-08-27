export const formatDate = (date: Date | string | number) => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

export const safeParseInt = (value: string | null | undefined, defaultValue: number = 0) => {
  if (!value) return defaultValue
  const parsed = parseInt(value)
  return isNaN(parsed) ? defaultValue : parsed
}