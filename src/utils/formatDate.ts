const MS_IN_DAY = 24 * 60 * 60 * 1000

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  // Same day -> show time
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isSameDay) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  // Yesterday
  const yesterday = new Date(now.getTime() - MS_IN_DAY)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) {
    return 'Yesterday'
  }

  // Fallback to short date (e.g. Mar 12)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

