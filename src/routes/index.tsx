import { useMemo, useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { startOfToday, parseISO, isValid, startOfDay, format } from 'date-fns'
import { List, LayoutGrid, Sun, Moon } from 'lucide-react'
import { api } from '../api'
import { DateSelector, Filters } from '../components'
import serializeParams from '../helpers/serializeParams'
import { MatchesView } from '../components/MatchesView'

export const Route = createFileRoute('/')({
  validateSearch: search => ({
    date: typeof search.date === 'string' ? search.date : undefined,
    sports: typeof search.sports === 'string' ? search.sports : undefined,
    countries:
      typeof search.countries === 'string' ? search.countries : undefined,
    competitions:
      typeof search.competitions === 'string' ? search.competitions : undefined,
    broadcasters:
      typeof search.broadcasters === 'string' ? search.broadcasters : undefined,
  }),
  component: RouteComponent,
})

const STORAGE_KEYS = {
  sports: 'selectedSports',
  countries: 'selectedCountries',
  competitions: 'selectedCompetitions',
  broadcasters: 'selectedBroadcasters',
} as const

const parseIds = (value: string | undefined) => {
  if (!value) return []
  return value
    .split(',')
    .map(item => parseInt(item, 10))
    .filter(id => Number.isFinite(id))
}

const serializeIds = (values: number[]) =>
  values.length > 0 ? values.join(',') : undefined

const readStoredIds = (key: string) => {
  const raw = sessionStorage.getItem(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as number[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(id => Number.isFinite(id))
  } catch {
    return []
  }
}

const writeStoredIds = (key: string, values: number[]) => {
  if (values.length === 0) {
    sessionStorage.removeItem(key)
    return
  }
  sessionStorage.setItem(key, JSON.stringify(values))
}

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const selectedDate = useMemo(() => {
    if (!search.date) return startOfToday()
    const parsed = parseISO(search.date)
    return isValid(parsed) ? startOfDay(parsed) : startOfToday()
  }, [search.date])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const selectedSports = useMemo(() => parseIds(search.sports), [search.sports])
  const selectedCountries = useMemo(
    () => parseIds(search.countries),
    [search.countries],
  )
  const selectedCompetitions = useMemo(
    () => parseIds(search.competitions),
    [search.competitions],
  )
  const selectedBroadcasters = useMemo(
    () => parseIds(search.broadcasters),
    [search.broadcasters],
  )

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

  useEffect(() => {
    if (!search.date) return
    const parsed = parseISO(search.date)
    if (!isValid(parsed)) {
      navigate({
        search: prev => ({
          ...prev,
          date: undefined,
        }),
        replace: true,
      })
    }
  }, [search.date, navigate])

  useEffect(() => {
    if (search.date) return
    navigate({
      search: prev => ({
        ...prev,
        date: format(startOfToday(), 'yyyy-MM-dd'),
      }),
      replace: true,
    })
  }, [search.date, navigate])

  useEffect(() => {
    if (
      search.sports ||
      search.countries ||
      search.competitions ||
      search.broadcasters
    ) {
      return
    }
    const storedSports = readStoredIds(STORAGE_KEYS.sports)
    const storedCountries = readStoredIds(STORAGE_KEYS.countries)
    const storedCompetitions = readStoredIds(STORAGE_KEYS.competitions)
    const storedBroadcasters = readStoredIds(STORAGE_KEYS.broadcasters)
    if (
      storedSports.length === 0 &&
      storedCountries.length === 0 &&
      storedCompetitions.length === 0 &&
      storedBroadcasters.length === 0
    ) {
      return
    }
    navigate({
      search: prev => ({
        ...prev,
        sports: serializeIds(storedSports),
        countries: serializeIds(storedCountries),
        competitions: serializeIds(storedCompetitions),
        broadcasters: serializeIds(storedBroadcasters),
      }),
      replace: true,
    })
  }, [
    search.sports,
    search.countries,
    search.competitions,
    search.broadcasters,
    navigate,
  ])

  const { data: sports } = useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      const res = await api.get('/sports')
      return res.data
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

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
    queryKey: ['competitions', selectedSports, selectedCountries],
    queryFn: async () => {
      const params: Record<string, string | string[] | number | number[]> = {}

      if (selectedSports.length > 0) {
        params.sport_ids = selectedSports
      }

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
      selectedSports,
      selectedCountries,
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

      if (selectedSports.length > 0) {
        params.sport_ids = selectedSports
      }

      if (selectedCountries.length > 0) {
        params.country_ids = selectedCountries
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
        selectedSports,
        selectedCountries,
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

        if (selectedSports.length > 0) {
          params.sport_ids = selectedSports
        }

        if (selectedCountries.length > 0) {
          params.country_ids = selectedCountries
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
          onSelect={date => {
            navigate({
              search: prev => ({
                ...prev,
                date: format(date, 'yyyy-MM-dd'),
              }),
            })
          }}
          initialDate="today"
          onMouseEnterDate={prefetchMatches}
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

        <Filters
          exclude={['channels']}
          sports={sports}
          selectedSports={selectedSports}
          onSportChange={values => {
            writeStoredIds(STORAGE_KEYS.sports, values)
            navigate({
              search: prev => ({
                ...prev,
                sports: serializeIds(values),
              }),
            })
          }}
          competitions={competitions}
          selectedCompetitions={selectedCompetitions}
          onCompetitionChange={values => {
            writeStoredIds(STORAGE_KEYS.competitions, values)
            navigate({
              search: prev => ({
                ...prev,
                competitions: serializeIds(values),
              }),
            })
          }}
          countries={countries}
          selectedCountries={selectedCountries}
          onCountryChange={values => {
            writeStoredIds(STORAGE_KEYS.countries, values)
            navigate({
              search: prev => ({
                ...prev,
                countries: serializeIds(values),
              }),
            })
          }}
          broadcasters={broadcasters}
          selectedBroadcasters={selectedBroadcasters}
          onBroadcastersChange={values => {
            writeStoredIds(STORAGE_KEYS.broadcasters, values)
            navigate({
              search: prev => ({
                ...prev,
                broadcasters: serializeIds(values),
              }),
            })
          }}
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
