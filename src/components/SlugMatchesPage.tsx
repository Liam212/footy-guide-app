import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { List, LayoutGrid, Sun, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { api } from '../api'
import serializeParams from '../helpers/serializeParams'
import { DateSelector } from './DateSelector'
import { MatchesView } from './MatchesView'
import { useDarkMode } from '../hooks/useDarkMode'
import { QuickLinks } from './QuickLinks'

interface SlugMatchesPageProps {
  title: string
  selectedDate: Date
  onDateChange: (date: Date) => void
  countryId?: number
  competitionId?: number
  broadcasterId?: number
  isLoadingFilters: boolean
  notFound: boolean
}

export function SlugMatchesPage({
  title,
  selectedDate,
  onDateChange,
  countryId,
  competitionId,
  broadcasterId,
  isLoadingFilters,
  notFound,
}: SlugMatchesPageProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const dateParam = format(selectedDate, 'yyyy-MM-dd')

  const { data, isLoading } = useQuery({
    queryKey: [
      'matches',
      dateParam,
      countryId ?? 'all',
      competitionId ?? 'all',
      broadcasterId ?? 'all',
    ],
    queryFn: async () => {
      const params: Record<string, string | string[] | number | number[]> = {
        start_date: dateParam,
        end_date: dateParam,
      }
      if (countryId) params.country_ids = [countryId]
      if (competitionId) params.competition_ids = [competitionId]
      if (broadcasterId) params.broadcaster_ids = [broadcasterId]

      const res = await api.get('/matches', {
        params,
        paramsSerializer: serializeParams,
      })
      return res.data
    },
    enabled: !notFound && !isLoadingFilters,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleDarkMode}
            className="text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h1>

        <QuickLinks />

        <DateSelector
          onSelect={onDateChange}
          initialDate="today"
          selectedDate={selectedDate}
        />

        <div className="flex justify-end">
          <button
            onClick={() =>
              setViewMode(prev => (prev === 'list' ? 'grid' : 'list'))
            }
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center space-x-2">
            {viewMode === 'list' ? <LayoutGrid /> : <List />}
          </button>
        </div>

        {notFound ? (
          <p className="text-gray-700 dark:text-gray-300 mt-6">
            No matching page found.
          </p>
        ) : isLoading || isLoadingFilters ? (
          <p className="text-gray-700 dark:text-gray-300 mt-6">
            Loading matches...
          </p>
        ) : data?.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300 mt-6">
            No matches found.
          </p>
        ) : (
          <MatchesView data={data} viewMode={viewMode} />
        )}
      </div>
    </div>
  )
}
