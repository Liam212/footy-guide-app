import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import { DateSelector, MatchCard } from '../components'
import { startOfToday } from 'date-fns'
import { List, LayoutGrid } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfToday())
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['matches', selectedDate?.toISOString().split('T')[0] ?? 'all'],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (selectedDate) {
        const formatted = selectedDate.toISOString().split('T')[0]
        params.start_date = formatted
        params.end_date = formatted
      }
      const res = await api.get('/matches', { params })
      return res.data
    },
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
  })

  const prefetchMatches = (date: Date) => {
    queryClient.prefetchQuery({
      queryKey: ['matches', date.toISOString().split('T')[0]],
      queryFn: async () => {
        const formatted = date.toISOString().split('T')[0]
        const res = await api.get('/matches', {
          params: { start_date: formatted, end_date: formatted },
        })
        return res.data
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }

  function renderMatches() {
    if (viewMode === 'list') {
      return (
        <div className="flex flex-col mt-6 space-y-4">
          {data.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {data.map((match: any) => (
            <MatchCard key={match.id} match={match} view={viewMode} />
          ))}
        </div>
      )
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 ">
      <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
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

        {isLoading ? (
          <p className="text-gray-700 dark:text-gray-300 mt-6">
            Loading matches...
          </p>
        ) : data?.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300 mt-6">
            No matches found.
          </p>
        ) : (
          renderMatches()
        )}
      </div>
    </div>
  )
}
