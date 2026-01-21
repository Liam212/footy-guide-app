import { useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { format, isValid, parseISO, startOfDay, startOfToday } from 'date-fns'
import { SlugMatchesPage } from '../../components/SlugMatchesPage'
import { useSlugFilters } from '../../hooks/useSlugFilters'

export const Route = createFileRoute('/c/$country/comp/$competition')({
  validateSearch: search => ({
    date: typeof search.date === 'string' ? search.date : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { country, competition } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const selectedDate = useMemo(() => {
    if (!search.date) return startOfToday()
    const parsed = parseISO(search.date)
    return isValid(parsed) ? startOfDay(parsed) : startOfToday()
  }, [search.date])

  useEffect(() => {
    if (search.date) {
      const parsed = parseISO(search.date)
      if (isValid(parsed)) return
    }
    navigate({
      search: prev => ({
        ...prev,
        date: format(startOfToday(), 'yyyy-MM-dd'),
      }),
      replace: true,
    })
  }, [search.date, navigate])

  const {
    country: countryData,
    competition: competitionData,
    isLoading,
    notFound,
  } = useSlugFilters({
    countrySlug: country,
    competitionSlug: competition,
  })

  const title =
    countryData && competitionData
      ? `${competitionData.name} in ${countryData.name}`
      : 'Matches'

  return (
    <SlugMatchesPage
      title={title}
      selectedDate={selectedDate}
      onDateChange={date =>
        navigate({
          search: prev => ({
            ...prev,
            date: format(date, 'yyyy-MM-dd'),
          }),
        })
      }
      countryId={countryData?.id}
      competitionId={competitionData?.id}
      isLoadingFilters={isLoading}
      notFound={notFound}
    />
  )
}
