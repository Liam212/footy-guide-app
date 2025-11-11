import { parseISO, addHours, isAfter, isBefore } from 'date-fns'

export type MatchStatus = 'finished' | 'ongoing' | 'upcoming'

export function getMatchStatus(date: string, time: string): MatchStatus {
  const matchDateTime = parseISO(`${date}T${time}`)
  const matchEndTime = addHours(matchDateTime, 2)
  const now = new Date()

  const isMatchInFuture = isAfter(matchDateTime, now)
  const isMatchInPast = isBefore(matchEndTime, now)
  const isMatchOngoing = !isMatchInFuture && !isMatchInPast

  if (isMatchInPast) return 'finished'
  if (isMatchOngoing) return 'ongoing'
  return 'upcoming'
}
