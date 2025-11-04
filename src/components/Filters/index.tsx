import { useState } from 'react'
import { Dropdown } from '../../primitives/Dropdown'

interface FiltersProps {
  competitions?: { id: number; name: string }[]
  channels?: { id: number; name: string }[]
  countries?: { id: number; name: string }[]
  onCountryChange?: (value: string) => void
  onCompetitionChange?: (value: string) => void
  onChannelChange?: (value: string) => void
}

export default function Filters({
  competitions = [],
  channels = [],
  countries = [],
  onCountryChange,
  onCompetitionChange,
  onChannelChange,
}: FiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCompetition, setSelectedCompetition] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    onCountryChange?.(value)
  }

  const handleCompetitionChange = (value: string) => {
    setSelectedCompetition(value)
    onCompetitionChange?.(value)
  }

  const handleChannelChange = (value: string) => {
    setSelectedChannel(value)
    onChannelChange?.(value)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4">
      <Dropdown
        options={countries.map(c => c.name)}
        value={selectedCountry}
        onChange={handleCountryChange}
        placeholder="All Countries"
        className="flex-1 md:flex-auto"
      />

      <Dropdown
        options={competitions.map(c => c.name)}
        value={selectedCompetition}
        onChange={handleCompetitionChange}
        placeholder="All Competitions"
        className="flex-1 md:flex-auto"
      />

      <Dropdown
        options={channels.map(c => c.name)}
        value={selectedChannel}
        onChange={handleChannelChange}
        placeholder="All Channels"
        className="flex-1 md:flex-auto"
      />
    </div>
  )
}
