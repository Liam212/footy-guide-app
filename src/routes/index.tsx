import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { startOfToday } from 'date-fns'
import { List, LayoutGrid, Sun, Moon } from 'lucide-react'
import { api } from '../api'
import { DateSelector, Filters } from '../components'
import serializeParams from '../helpers/serializeParams'
import { MatchesView } from '../components/MatchesView'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfToday())
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selectedCompetitions, setSelectedCompetitions] = useState<number[]>([])
  const [selectedCountries, setSelectedCountries] = useState<number[]>([])
  const [selectedBroadcasters, setSelectedBroadcasters] = useState<number[]>([])

  const getInitialDarkMode = () => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await api.get('/countries')
      return res.data
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const { data: competitions } = useQuery({
    queryKey: ['competitions', selectedCountries],
    queryFn: async () => {
      const params: Record<string, string | string[] | number | number[]> = {}

      if (selectedCountries.length > 0) {
        params.country_ids = selectedCountries
      }

      const res = await api.get('/competitions', {
        params,
        paramsSerializer: serializeParams,
      })

      return res.data
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const { data: broadcasters } = useQuery({
    queryKey: ['broadcasters'],
    queryFn: async () => {
      const res = await api.get('/broadcasters')
      return res.data
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const { data, isLoading } = useQuery({
    queryKey: [
      'matches',
      selectedDate?.toISOString().split('T')[0] ?? 'all',
      selectedCompetitions,
      selectedBroadcasters,
    ],
    queryFn: async () => {
      const params: Record<string, string | string[] | number | number[]> = {}

      if (selectedDate) {
        const formatted = selectedDate.toISOString().split('T')[0]
        params.start_date = formatted
        params.end_date = formatted
      }

      if (selectedCompetitions.length > 0) {
        params.competition_ids = selectedCompetitions
      }

      if (selectedBroadcasters.length > 0) {
        params.broadcaster_ids = selectedBroadcasters
      }

      const res = await api.get('/matches', {
        params,
        paramsSerializer: serializeParams,
      })
      return res.data
    },
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
  })

  const prefetchMatches = (date: Date) => {
    queryClient.prefetchQuery({
      queryKey: [
        'matches',
        date.toISOString().split('T')[0],
        selectedCompetitions,
        selectedBroadcasters,
      ],
      queryFn: async () => {
        const params: Record<string, string | string[] | number | number[]> = {}

        if (selectedDate) {
          const formatted = date.toISOString().split('T')[0]
          params.start_date = formatted
          params.end_date = formatted
        }

        if (selectedCompetitions.length > 0) {
          params.competition_ids = selectedCompetitions
        }

        if (selectedBroadcasters.length > 0) {
          params.broadcaster_ids = selectedBroadcasters
        }

        const res = await api.get('/matches', {
          params,
          paramsSerializer: serializeParams,
        })
        return res.data
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className="text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Matches
        </h1>

        <DateSelector
          onSelect={setSelectedDate}
          initialDate="today"
          onMouseEnterDate={prefetchMatches}
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

        <Filters
          exclude={['channels']}
          competitions={competitions}
          onCompetitionChange={setSelectedCompetitions}
          countries={countries}
          onCountryChange={setSelectedCountries}
          broadcasters={broadcasters}
          onBroadcastersChange={setSelectedBroadcasters}
        />

        {isLoading ? (
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
