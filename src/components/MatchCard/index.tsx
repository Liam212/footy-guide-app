import { useRef, useState } from 'react'
import { Share2 } from 'lucide-react'
import { getMatchStatus, type MatchStatus } from '../../helpers/matchStatus'
import { ChannelPills } from '../ChannelPills'

interface MatchCardProps {
  id: number
  sport_id?: number
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
  const { channels, time, date, competition, home_team, away_team, sport_id } =
    match
  const status = match.status ?? getMatchStatus(date, time, sport_id)
  const [shareState, setShareState] = useState<
    'idle' | 'copied' | 'shared' | 'error'
  >('idle')
  const resetTimer = useRef<number | null>(null)

  const matchStatusBorderColor = {
    finished: 'border-red-500',
    ongoing: 'border-green-500',
    upcoming: 'border-blue-500',
  }

  const getMatchUrl = () =>
    new URL(`/matches/${match.id}`, window.location.origin).toString()

  const resetShareState = () => {
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current)
    }
    resetTimer.current = window.setTimeout(() => {
      setShareState('idle')
    }, 2200)
  }

  const handleShare = async () => {
    const url = getMatchUrl()

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${home_team.name} vs ${away_team.name}`,
          text: `${competition.name} • ${date} ${time}`,
          url,
        })
        setShareState('shared')
        resetShareState()
        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setShareState('copied')
        resetShareState()
        return
      }

      setShareState('error')
      resetShareState()
    } catch {
      setShareState('error')
      resetShareState()
    }
  }

  const shareLabel =
    shareState === 'copied'
      ? 'Copied'
      : shareState === 'shared'
        ? 'Shared'
        : shareState === 'error'
          ? 'Error'
          : 'Share'

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
        <ChannelPills
          channels={channels}
          containerClassName="flex flex-wrap gap-2 mt-2"
          fallbackClassName="px-3 py-1 rounded-full text-xs font-semibold border inline-flex"
          pillClassName="px-2 py-0.5 rounded text-xs font-semibold"
        />
      </div>
      <div className="flex flex-col items-start sm:items-end text-gray-800 dark:text-gray-100 text-sm sm:text-base font-medium">
        <span className="text-lg font-semibold tracking-wide">{time}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{date}</span>
        <button
          type="button"
          onClick={handleShare}
          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition">
          <Share2 className="h-4 w-4" />
          {shareLabel}
        </button>
      </div>
    </div>
  )
}
