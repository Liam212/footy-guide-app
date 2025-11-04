interface MatchCardProps {
  channels: {
    id: number
    name: string
    primary_color: string
    secondary_color: string
    text_color: string
  }[]
  time: string
  date: string
  home_team: {
    id: number
    name: string
    logo_url: string
  }
  away_team: {
    id: number
    name: string
    logo_url: string
  }
  competition: {
    id: number
    name: string
  }
  country?: {
    id: number
    name: string
    iso_code: string
  }
}

export function MatchCard({ match }: { match: MatchCardProps }) {
  const { channels, time, date, competition, country, home_team, away_team } =
    match

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-1 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4 border border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <p className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-300 mb-1">
          {home_team.name} vs {away_team.name}
        </p>

        <p className="text-xs sm:text-base font-light text-gray-800 dark:text-gray-100">
          {competition.name}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          {channels.map(channel => (
            <div
              key={channel.id}
              className="px-2 py-.5 rounded"
              style={{
                backgroundColor: channel.primary_color,
                border: `1px solid ${channel.secondary_color}`,
              }}>
              <span
                className="text-sm font-semibold text-xs"
                style={{ color: channel.text_color }}>
                {channel.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end text-gray-600 dark:text-gray-300 text-sm">
        <span>{time}</span>
        <span>{date}</span>
      </div>
    </div>
  )
}
