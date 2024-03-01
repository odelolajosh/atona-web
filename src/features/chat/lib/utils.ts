export const formatDate = (date: Date | string | number) => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}