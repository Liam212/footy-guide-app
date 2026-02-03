import { DropdownMultiSelect } from '../../primitives/Dropdown'

interface FiltersProps {
  exclude?: ('sports' | 'countries' | 'competitions' | 'channels' | 'broadcasters')[]
  sports?: { id: number; name: string }[]
  competitions?: { id: number; name: string }[]
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
  const handleSportChange = (values: string[]) => {
    onSportChange?.(values.map(s => parseInt(s)))
  }

  const handleCountryChange = (values: string[]) => {
    onCountryChange?.(values.map(s => parseInt(s)))
  }

  const handleCompetitionChange = (values: string[]) => {
    onCompetitionChange?.(values.map(s => parseInt(s)))
  }

  const handleChannelChange = (values: string[]) => {
    onChannelChange?.(values.map(s => parseInt(s)))
  }

  const handleBroadcastersChange = (values: string[]) => {
    onBroadcastersChange?.(values.map(s => parseInt(s)))
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {!exclude.includes('sports') && (
        <div className="flex-1">
          <label
            htmlFor="sports"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sport
          </label>
          <DropdownMultiSelect
            // @ts-expect-error
            options={sports.map(s => ({
              key: s.id.toString(),
              value: s.id,
              label: s.name,
            }))}
            // @ts-expect-error
            value={selectedSports}
            onChange={handleSportChange}
            placeholder="All Sports"
            className="w-full"
          />
        </div>
      )}

      {!exclude.includes('countries') && (
        <div className="flex-1">
          <label
            htmlFor="countries"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <DropdownMultiSelect
            // @ts-expect-error
            options={countries.map(c => ({
              key: c.id.toString(),
              value: c.id,
              label: c.name,
            }))}
            // @ts-expect-error
            value={selectedCountries}
            onChange={handleCountryChange}
            placeholder="Select countries"
            className="w-full"
            searchable // enable search input
          />
        </div>
      )}

      {!exclude.includes('competitions') && (
        <div className="flex-1">
          <label
            htmlFor="competitions"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Competitions
          </label>
          <DropdownMultiSelect
            // @ts-expect-error
            options={competitions.map(c => ({
              key: c.id.toString(),
              value: c.id,
              label: c.name,
            }))}
            // @ts-expect-error
            value={selectedCompetitions}
            onChange={handleCompetitionChange}
            placeholder="All Competitions"
            className="w-full"
          />
        </div>
      )}

      {!exclude.includes('broadcasters') && (
        <div className="flex-1">
          <label
            htmlFor="broadcasters"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Broadcasters
          </label>
          <DropdownMultiSelect
            // @ts-expect-error
            options={broadcasters.map(c => ({
              key: c.id.toString(),
              value: c.id,
              label: c.name,
            }))}
            // @ts-expect-error
            value={selectedBroadcasters}
            onChange={handleBroadcastersChange}
            placeholder="All Broadcasters"
            className="w-full"
          />
        </div>
      )}

      {!exclude.includes('channels') && (
        <div className="flex-1">
          <label
            htmlFor="channels"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Channels
          </label>
          <DropdownMultiSelect
            // @ts-expect-error
            options={channels.map(c => ({
              key: c.id.toString(),
              value: c.id,
              label: c.name,
            }))}
            // @ts-expect-error
            value={selectedChannels}
            onChange={handleChannelChange}
            placeholder="All Channels"
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
