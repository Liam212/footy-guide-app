import { parseISO, addMinutes, isAfter, isBefore } from 'date-fns'

export type MatchStatus = 'finished' | 'ongoing' | 'upcoming'

const DEFAULT_MATCH_DURATION_MINUTES = 120
const SPORT_MATCH_DURATION_MINUTES: Record<number, number> = {
  1: 120,
  2: 210,
  3: 120,
  4: 30,
}

export function getMatchStatus(
  date: string,
  time?: string,
  sportId?: number,
): MatchStatus {
  const normalizedTime = time && time.trim().length > 0 ? time : '00:00'
  const matchDateTime = parseISO(`${date}T${normalizedTime}`)
  const durationMinutes =
    (sportId ? SPORT_MATCH_DURATION_MINUTES[sportId] : undefined) ??
    DEFAULT_MATCH_DURATION_MINUTES
  const matchEndTime = addMinutes(matchDateTime, durationMinutes)
  const now = new Date()

  const isMatchInFuture = isAfter(matchDateTime, now)
  const isMatchInPast = isBefore(matchEndTime, now)
  const isMatchOngoing = !isMatchInFuture && !isMatchInPast

  if (isMatchInPast) return 'finished'
  if (isMatchOngoing) return 'ongoing'
  return 'upcoming'
}
