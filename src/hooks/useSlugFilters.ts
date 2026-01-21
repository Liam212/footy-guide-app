import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import serializeParams from '../helpers/serializeParams'
import { slugify } from '../helpers/slugify'

interface SlugFilters {
  countrySlug?: string
  competitionSlug?: string
  broadcasterSlug?: string
}

interface Country {
  id: number
  name: string
}

interface Competition {
  id: number
  name: string
  country?: string
  country_id?: number
}

interface Broadcaster {
  id: number
  name: string
}

export function useSlugFilters(slugs: SlugFilters) {
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await api.get('/countries')
      return res.data as Country[]
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const country = useMemo(() => {
    if (!slugs.countrySlug) return undefined
    return countries.find(c => slugify(c.name) === slugs.countrySlug)
  }, [slugs.countrySlug, countries])

  const shouldLoadCompetitions =
    Boolean(slugs.competitionSlug) && (!slugs.countrySlug || Boolean(country))
  const { data: competitions = [], isLoading: isLoadingCompetitions } = useQuery(
    {
      queryKey: [
        'competitions',
        shouldLoadCompetitions ? country?.id ?? 'all' : 'skip',
      ],
      queryFn: async () => {
        const params: Record<string, string | string[] | number | number[]> = {}
        if (country) {
          params.country_ids = [country.id]
        }
        const res = await api.get('/competitions', {
          params,
          paramsSerializer: serializeParams,
        })
        return res.data as Competition[]
      },
      enabled: shouldLoadCompetitions,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  )

  const competition = useMemo(() => {
    if (!slugs.competitionSlug) return undefined
    if (slugs.countrySlug) {
      return competitions.find(
        c => slugify(c.name) === slugs.competitionSlug,
      )
    }

    return competitions.find(comp => {
      const countryName =
        comp.country || countries.find(c => c.id === comp.country_id)?.name
      if (!countryName) return false
      const compositeSlug = `${slugify(countryName)}-${slugify(comp.name)}`
      return compositeSlug === slugs.competitionSlug
    })
  }, [slugs.competitionSlug, slugs.countrySlug, competitions, countries])

  const { data: broadcasters = [], isLoading: isLoadingBroadcasters } =
    useQuery({
      queryKey: ['broadcasters'],
      queryFn: async () => {
        const res = await api.get('/broadcasters')
        return res.data as Broadcaster[]
      },
      enabled: Boolean(slugs.broadcasterSlug),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    })

  const broadcaster = useMemo(() => {
    if (!slugs.broadcasterSlug) return undefined
    return broadcasters.find(b => slugify(b.name) === slugs.broadcasterSlug)
  }, [slugs.broadcasterSlug, broadcasters])

  const notFound =
    (slugs.countrySlug && !isLoadingCountries && !country) ||
    (slugs.competitionSlug && !isLoadingCompetitions && !competition) ||
    (slugs.broadcasterSlug && !isLoadingBroadcasters && !broadcaster)

  return {
    country,
    competition,
    broadcaster,
    isLoading: isLoadingCountries || isLoadingCompetitions || isLoadingBroadcasters,
    notFound,
  }
}
