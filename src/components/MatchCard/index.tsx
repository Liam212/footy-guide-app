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

export function MatchCard({
  match,
  view = 'list',
}: {
  match: MatchCardProps
  view?: 'list' | 'grid'
}) {
  const { channels, time, date, competition, home_team, away_team } = match

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-md p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col ${
        view === 'list' ? 'sm:flex-row sm:justify-between sm:items-center' : ''
      }`}>
      <div className={`flex-1 ${view === 'grid' ? 'mb-3' : 'mb-0'}`}>
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
            <span
              key={channel.id}
              className="px-2 py-0.5 rounded text-xs font-semibold"
              style={{
                backgroundColor: channel.primary_color,
                border: `1px solid ${channel.secondary_color}`,
                color: channel.text_color,
              }}>
              {channel.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end text-gray-700 dark:text-gray-300 text-sm sm:text-base">
        <span>{time}</span>
        <span>{date}</span>
      </div>
    </div>
  )
}
