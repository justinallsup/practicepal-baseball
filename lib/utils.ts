/**
 * Date utilities for PracticePal Baseball
 */

/**
 * Returns today's date as 'YYYY-MM-DD'
 */
export function getToday(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns an array of date strings 'YYYY-MM-DD' for Mon–Sun of the current week
 */
export function getWeekDates(): string[] {
  const today = new Date()
  // Day of week: 0=Sun, 1=Mon, ... 6=Sat
  const dow = today.getDay()
  // Offset to Monday (if Sunday dow=0, offset=-6; else offset=1-dow)
  const offsetToMonday = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + offsetToMonday)

  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }
  return dates
}

/**
 * Returns abbreviated day label: 'Mon', 'Tue', etc.
 */
export function dayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return labels[d.getDay()]
}

/**
 * Format a streak number into a human-readable string
 */
export function formatStreak(streak: number): string {
  if (streak === 0) return 'No streak yet'
  if (streak === 1) return '1 day'
  return `${streak} days`
}

/**
 * Convert 'YYYY-MM-DD' to a Date object (local time)
 */
export function dateFromString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}
