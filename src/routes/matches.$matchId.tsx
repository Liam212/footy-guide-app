import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { Moon, Sun } from 'lucide-react'
import { api } from '../api'
import { ChannelPills } from '../components/ChannelPills'
import isNumeric from '../helpers/isNumeric'
import { getMatchStatus } from '../helpers/matchStatus'
import type { Match } from '../types'

const matchQueryKey = (matchId: string | number) => ['match', matchId]

const fetchMatch = async (matchId: string) => {
  const res = await api.get(`/matches/${matchId}`)
  return res.data as Match
}

export const Route = createFileRoute('/matches/$matchId')({
  loader: async ({ params, context }) => {
    const { matchId } = params as { matchId: string }

    if (!isNumeric(matchId)) {
      return null
    }

    try {
      const match = await context.queryClient.fetchQuery({
        queryKey: matchQueryKey(matchId),
        queryFn: () => fetchMatch(matchId),
      })
      return match
    } catch {
      return null
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matchId } = Route.useParams()
  const loaderData = Route.useLoaderData() as Match | null
  const isMatchIdValid = isNumeric(matchId)
  const getInitialDarkMode = () => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) return stored === 'true'
    return true
  }
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode)
  const { data: match, isLoading } = useQuery({
    queryKey: matchQueryKey(matchId),
    queryFn: () => fetchMatch(matchId),
    initialData: loaderData ?? undefined,
    enabled: isMatchIdValid,
  })

  useEffect(() => {
    if (!match) return
    const home = match.home_team?.name ?? 'Match'
    const away = match.away_team?.name ?? ''
    document.title = away ? `${home} vs ${away} | Footy Guide` : home
  }, [match])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
          <p className="text-gray-700 dark:text-gray-300">Loading match...</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
          <p className="text-gray-700 dark:text-gray-300">Match not found.</p>
          <Link
            to="/"
            search={{
              date: undefined,
              sports: undefined,
              countries: undefined,
              competitions: undefined,
              broadcasters: undefined,
            }}
            className="inline-flex mt-4 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200">
            Back to matches
          </Link>
        </div>
      </div>
    )
  }

  const status = getMatchStatus(match.date, match.time, match.sport_id)
  const matchDayLabel = (() => {
    try {
      return format(parseISO(match.date), 'EEE, MMM d')
    } catch {
      return match.date
    }
  })()
  const statusStyles = {
    finished:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200',
    ongoing:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-200',
    upcoming:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200',
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            search={{
              date: match.date,
              sports: undefined,
              countries: undefined,
              competitions: undefined,
              broadcasters: undefined,
            }}
            className="text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200">
            ← See more on {matchDayLabel}
          </Link>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${statusStyles[status]}`}>
              {status}
            </span>
            <button
              type="button"
              onClick={() => setIsDarkMode(prev => !prev)}
              className="text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none"
              aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex items-center gap-4">
              {match.home_team?.logo_url && (
                <img
                  src={match.home_team.logo_url}
                  alt={match.home_team.name}
                  className="w-14 h-14 object-contain"
                />
              )}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Home
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {match.home_team?.name}
                </p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Competition
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {match.competition?.name ?? 'TBC'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Kickoff
                </p>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {match.date}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Time
                  </p>
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                    {match.time ?? 'TBC'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-start md:justify-end">
              <div className="text-left md:text-right">
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Away
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {match.away_team?.name ?? 'TBC'}
                </p>
              </div>
              {match.away_team?.logo_url && (
                <img
                  src={match.away_team.logo_url}
                  alt={match.away_team.name}
                  className="w-14 h-14 object-contain"
                />
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Watch on
            </h2>
            {match.channels?.length ? (
              <ChannelPills
                channels={match.channels}
                containerClassName="flex flex-wrap gap-2"
                pillClassName="px-3 py-1 rounded-full text-xs font-semibold border inline-flex"
                fallbackClassName="px-3 py-1 rounded-full text-xs font-semibold border inline-flex bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600"
              />
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No broadcasters listed yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
