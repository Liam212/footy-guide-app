import { useState } from 'react'
import { Dropdown } from '../../primitives/Dropdown'

interface FiltersProps {
  exclude?: ('countries' | 'competitions' | 'channels')[]
  competitions?: { id: number; name: string }[]
  channels?: { id: number; name: string }[]
  countries?: { id: number; name: string }[]
  onCountryChange?: (value: number) => void
  onCompetitionChange?: (value: number[]) => void
  onChannelChange?: (value: number[]) => void
}

export default function Filters({
  exclude = [],
  competitions = [],
  channels = [],
  countries = [],
  onCountryChange,
  onCompetitionChange,
  onChannelChange,
}: FiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null)
  const [selectedCompetitions, setSelectedCompetitions] = useState<number[]>([])
  const [selectedChannels, setSelectedChannels] = useState<number[]>([])

  const handleCountryChange = (value: number) => {
    setSelectedCountry(value)
    onCountryChange?.(value)
  }

  const handleCompetitionChange = (values: number[]) => {
    setSelectedCompetitions(values)
    onCompetitionChange?.(values)
  }

  const handleChannelChange = (values: number[]) => {
    setSelectedChannels(values)
    onChannelChange?.(values)
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
          <Dropdown
            options={countries.map(c => ({
              key: c.id.toString(),
              value: c.id, // 🔹 pass numeric ID
              label: c.name,
            }))}
            value={selectedCountry ?? undefined}
            onChange={handleCountryChange}
            placeholder="All Countries"
            className="w-full"
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
          <Dropdown
            options={competitions.map(c => ({
              key: c.id.toString(),
              value: c.id, // 🔹 numeric ID
              label: c.name,
            }))}
            value={selectedCompetitions}
            onChange={handleCompetitionChange}
            placeholder="All Competitions"
            className="w-full"
            multiSelect
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
          <Dropdown
            options={channels.map(c => ({
              key: c.id.toString(),
              value: c.value, // 🔹 numeric ID
              label: c.label,
            }))}
            value={selectedChannels}
            onChange={handleChannelChange}
            placeholder="All Channels"
            className="w-full"
            multiSelect
          />
        </div>
      )}
    </div>
  )
}
