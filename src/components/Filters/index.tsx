import { DropdownMultiSelect } from '../../primitives/Dropdown'

interface FiltersProps {
  exclude?: ('countries' | 'competitions' | 'channels' | 'broadcasters')[]
  competitions?: { id: number; name: string }[]
  channels?: { id: number; name: string }[]
  countries?: { id: number; name: string }[]
  broadcasters?: { id: number; name: string }[]
  selectedCountries?: number[]
  selectedCompetitions?: number[]
  selectedChannels?: number[]
  selectedBroadcasters?: number[]
  onCountryChange?: (value: number[]) => void
  onCompetitionChange?: (value: number[]) => void
  onChannelChange?: (value: number[]) => void
  onBroadcastersChange?: (value: number[]) => void
}

export function Filters({
  exclude = [],
  competitions = [],
  channels = [],
  countries = [],
  broadcasters = [],
  selectedCountries = [],
  selectedCompetitions = [],
  selectedChannels = [],
  selectedBroadcasters = [],
  onCountryChange,
  onCompetitionChange,
  onChannelChange,
  onBroadcastersChange,
}: FiltersProps) {
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
