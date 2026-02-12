import { useMemo, useState } from 'react'
import { DropdownMultiSelect } from '../../primitives/Dropdown'

interface FiltersProps {
  exclude?: (
    | 'sports'
    | 'countries'
    | 'competitions'
    | 'channels'
    | 'broadcasters'
  )[]
  sports?: { id: number; name: string }[]
  competitions?: { id: number; name: string; tier?: number | null }[]
  channels?: { id: number; name: string }[]
  countries?: { id: number; name: string }[]
  broadcasters?: { id: number; name: string }[]
  selectedSports?: number[]
  selectedCountries?: number[]
  selectedCompetitions?: number[]
  selectedChannels?: number[]
  selectedBroadcasters?: number[]
  onSportChange?: (value: number[]) => void
  onCountryChange?: (value: number[]) => void
  onCompetitionChange?: (value: number[]) => void
  onChannelChange?: (value: number[]) => void
  onBroadcastersChange?: (value: number[]) => void
}

export function Filters({
  exclude = [],
  sports = [],
  competitions = [],
  channels = [],
  countries = [],
  broadcasters = [],
  selectedSports = [],
  selectedCountries = [],
  selectedCompetitions = [],
  selectedChannels = [],
  selectedBroadcasters = [],
  onSportChange,
  onCountryChange,
  onCompetitionChange,
  onChannelChange,
  onBroadcastersChange,
}: FiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(
    selectedBroadcasters.length > 0 || selectedChannels.length > 0,
  )

  const handleCountryChange = (values: number[]) => {
    onCountryChange?.(values)
  }

  const handleCompetitionChange = (values: number[]) => {
    onCompetitionChange?.(values)
  }

  const handleChannelChange = (values: number[]) => {
    onChannelChange?.(values)
  }

  const handleBroadcastersChange = (values: number[]) => {
    onBroadcastersChange?.(values)
  }

  const competitionsDisabled = selectedCountries.length === 0
  const showCompetitions =
    !exclude.includes('competitions') &&
    (!competitionsDisabled || selectedCompetitions.length > 0)
  const competitionsSorted = [...competitions].sort((a, b) => {
    const aTier = a.tier ?? Number.POSITIVE_INFINITY
    const bTier = b.tier ?? Number.POSITIVE_INFINITY
    if (aTier !== bTier) return aTier - bTier
    return a.name.localeCompare(b.name)
  })

  const hasAdvancedFilters =
    (!exclude.includes('broadcasters') && broadcasters.length > 0) ||
    (!exclude.includes('channels') && channels.length > 0)

  const sportsAllSelected =
    sports.length > 0 &&
    (selectedSports.length === 0 || selectedSports.length === sports.length)

  const selectedSportIds = useMemo(() => {
    if (selectedSports.length === 0) return new Set<number>()
    return new Set(selectedSports)
  }, [selectedSports])

  const handleSportPillToggle = (sportId: number) => {
    if (sports.length === 0) return

    let nextSelected: number[] = []

    if (selectedSports.length === 0) {
      nextSelected = [sportId]
    } else if (selectedSportIds.has(sportId)) {
      nextSelected = selectedSports.filter(id => id !== sportId)
    } else {
      nextSelected = [...selectedSports, sportId]
    }

    if (nextSelected.length === 0 || nextSelected.length === sports.length) {
      onSportChange?.([])
      return
    }

    onSportChange?.(nextSelected)
  }

  return (
    <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col gap-4">
        {!exclude.includes('sports') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sport
            </label>
            <div className="flex flex-wrap gap-2">
              {sports.map(sport => {
                const isActive =
                  sportsAllSelected || selectedSportIds.has(sport.id)
                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => handleSportPillToggle(sport.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800 ${
                      isActive
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-gray-500'
                    }`}>
                    {sport.name}
                  </button>
                )
              })}
              {sports.length === 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No sports available.
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!exclude.includes('countries') && (
            <div>
              <label
                htmlFor="countries"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <DropdownMultiSelect
                options={countries.map(c => ({
                  key: c.id.toString(),
                  value: c.id,
                  label: c.name,
                }))}
                value={selectedCountries}
                onChange={handleCountryChange}
                placeholder="Select countries"
                className="w-full"
                searchable // enable search input
              />
              {!exclude.includes('competitions') && competitionsDisabled && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Pick a country to filter competitions.
                </p>
              )}
            </div>
          )}

          {showCompetitions && (
            <div>
              <label
                htmlFor="competitions"
                className={`block text-sm font-medium mb-1 ${
                  competitionsDisabled
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                Competitions
              </label>
              <DropdownMultiSelect
                options={competitionsSorted.map(c => ({
                  key: c.id.toString(),
                  value: c.id,
                  label: c.name,
                }))}
                value={selectedCompetitions}
                onChange={handleCompetitionChange}
                placeholder={
                  competitionsDisabled
                    ? 'Select a country first'
                    : 'All Competitions'
                }
                className="w-full"
                disabled={competitionsDisabled}
                searchable
              />
            </div>
          )}
        </div>

        {hasAdvancedFilters && (
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(prev => !prev)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition">
              {showAdvanced ? 'Hide advanced filters' : 'More filters'}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {!exclude.includes('broadcasters') && (
                  <div>
                    <label
                      htmlFor="broadcasters"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Broadcasters
                    </label>
                    <DropdownMultiSelect
                      options={broadcasters.map(c => ({
                        key: c.id.toString(),
                        value: c.id,
                        label: c.name,
                      }))}
                      value={selectedBroadcasters}
                      onChange={handleBroadcastersChange}
                      placeholder="All Broadcasters"
                      className="w-full"
                    />
                  </div>
                )}

                {!exclude.includes('channels') && (
                  <div>
                    <label
                      htmlFor="channels"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Channels
                    </label>
                    <DropdownMultiSelect
                      options={channels.map(c => ({
                        key: c.id.toString(),
                        value: c.id,
                        label: c.name,
                      }))}
                      value={selectedChannels}
                      onChange={handleChannelChange}
                      placeholder="All Channels"
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
