import { getMatchStatus, type MatchStatus } from '../../helpers/matchStatus'

interface MatchCardProps {
  channels: {
    id: number
    name: string
    primary_color: string
    secondary_color: string
    text_color: string
    broadcaster_id: string
  }[]
  time: string
  date: string
  home_team: { id: number; name: string; logo_url: string }
  away_team: { id: number; name: string; logo_url: string }
  competition: { id: number; name: string }
  country?: { id: number; name: string; iso_code: string }
  status?: MatchStatus
  view?: 'list' | 'grid'
}

export function MatchCard({
  match,
  view = 'list',
}: {
  match: MatchCardProps
  view?: 'list' | 'grid'
}) {
  const { channels, time, date, competition, home_team, away_team } = match
  const status = match.status ?? getMatchStatus(date, time)

  const matchStatusBorderColor = {
    finished: 'border-red-500',
    ongoing: 'border-green-500',
    upcoming: 'border-blue-500',
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg flex flex-col ${
        view === 'list' ? 'sm:flex-row sm:justify-between sm:items-center' : ''
      } ${matchStatusBorderColor[status]} ${status === 'finished' && 'opacity-40'} border-l-4`}>
      <div className={`flex-1 ${view === 'grid' ? 'mb-3' : 'mb-0'}`}>
        {status === 'ongoing' && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-white text-xs font-bold px-3 py-1 rounded bg-red-500 animate-pulse-slow tracking-wide">
              &#9675; LIVE
            </span>
          </div>
        )}
        <p
          className={`text-lg ${view === 'grid' ? 'sm:text-s' : 'sm:text-xl'} font-bold text-gray-900 dark:text-gray-100`}>
          {home_team.name} vs {away_team.name}
        </p>
        <p
          className={`text-sm ${view === 'grid' ? 'sm:text-xs' : 'sm:text-base '} text-gray-600 dark:text-gray-300 mt-1`}>
          {competition.name}
        </p>
        <div className="flex flex-wrap mt-2 gap-2">
          {channels.map(channel => (
            <a key={channel.id} href={`/broadcaster/${channel.broadcaster_id}`}>
              <span
                className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{
                  backgroundColor: channel.primary_color,
                  border: `1px solid ${channel.secondary_color}`,
                  color: channel.text_color,
                }}>
                {channel.name}
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start sm:items-end text-gray-800 dark:text-gray-100 text-sm sm:text-base font-medium">
        <span className="text-lg font-semibold tracking-wide">{time}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{date}</span>
      </div>
    </div>
  )
}
