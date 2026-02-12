import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { getMatchStatus } from '../../helpers/matchStatus'
import { MatchCard } from '../MatchCard'

export function MatchesView({
  data,
  viewMode,
}: {
  data: any[]
  viewMode: 'list' | 'grid'
}) {
  const [showPast, setShowPast] = useState(false)

  const grouped = {
    upcoming: [] as any[],
    ongoing: [] as any[],
    finished: [] as any[],
  }

  for (const match of data) {
    const status = getMatchStatus(match.date, match.time, match.sport_id)
    grouped[status].push(match)
  }

  function renderMatchGroup(matches: any[]) {
    if (viewMode === 'list') {
      return (
        <div className="flex flex-col mt-4 space-y-4">
          {matches.map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {matches.map(m => (
          <MatchCard key={m.id} match={m} view={viewMode} />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-6">
      {grouped.finished.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowPast(prev => !prev)}
            className="flex items-center text-lg font-semibold mb-2 text-white">
            {showPast ? (
              <ChevronDown className="w-5 h-5 mr-1" />
            ) : (
              <ChevronRight className="w-5 h-5 mr-1" />
            )}
            Past Matches
          </button>

          {showPast && renderMatchGroup(grouped.finished)}
        </div>
      )}

      {grouped.ongoing.length > 0 && renderMatchGroup(grouped.ongoing)}

      {grouped.upcoming.length > 0 && renderMatchGroup(grouped.upcoming)}
    </div>
  )
}
