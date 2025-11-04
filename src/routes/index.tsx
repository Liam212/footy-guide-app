import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { DateSelector, MatchCard } from '../components'
import { startOfToday } from 'date-fns'

const matchesQuery = queryOptions({
  queryKey: ['matches'],
  queryFn: () => api.get('/matches').then(r => r.data),
})

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(matchesQuery),
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfToday())

  const { data, isLoading } = useQuery({
    queryKey: ['matches', selectedDate],
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

  return (
    <div className="bg-gray-950 min-h-screen p-4 max-w-2xl mx-auto">
      <DateSelector onSelect={setSelectedDate} initialDate="today" />

      {isLoading ? (
        <p className="text-white mt-4">Loading...</p>
      ) : (
        <div className="flex flex-col mt-4">
          {data.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
