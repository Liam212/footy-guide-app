import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { api } from '../api'
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
      return await context.queryClient.fetchQuery({
        queryKey: matchQueryKey(matchId),
        queryFn: () => fetchMatch(matchId),
      })
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-gray-500 dark:text-gray-400">Loading match...</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-gray-500 dark:text-gray-400">
            Match not found.
          </p>
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

  const status = getMatchStatus(match.date, match.time ?? '00:00')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            search={{
              date: undefined,
              sports: undefined,
              countries: undefined,
              competitions: undefined,
              broadcasters: undefined,
            }}
            className="text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200">
            ← Back to matches
          </Link>
          <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {status}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              {match.home_team?.logo_url && (
                <img
                  src={match.home_team.logo_url}
                  alt={match.home_team.name}
                  className="w-14 h-14 object-contain"
                />
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Home
                </p>
                <p className="text-xl font-semibold">
                  {match.home_team?.name}
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {match.competition?.name}
              </p>
              <p className="text-lg font-semibold mt-2">
                {match.date} {match.time ?? ''}
              </p>
            </div>

            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Away
                </p>
                <p className="text-xl font-semibold">
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

          <div>
            <h2 className="text-lg font-semibold mb-3">Watch on</h2>
            {match.channels?.length ? (
              <div className="flex flex-wrap gap-2">
                {match.channels.map(channel =>
                  channel.broadcaster_id ? (
                    <Link
                      key={channel.id}
                      to="/broadcaster/$broadcaster"
                      params={{
                        broadcaster: String(channel.broadcaster_id),
                      }}
                      className="px-3 py-1 rounded text-xs font-semibold border inline-flex"
                      style={{
                        backgroundColor: channel.primary_color ?? '#e2e8f0',
                        borderColor: channel.secondary_color ?? '#cbd5f5',
                        color: channel.text_color ?? '#0f172a',
                      }}>
                      {channel.name}
                    </Link>
                  ) : (
                    <span
                      key={channel.id}
                      className="px-3 py-1 rounded text-xs font-semibold border inline-flex"
                      style={{
                        backgroundColor: channel.primary_color ?? '#e2e8f0',
                        borderColor: channel.secondary_color ?? '#cbd5f5',
                        color: channel.text_color ?? '#0f172a',
                      }}>
                      {channel.name}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No broadcasters listed yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
