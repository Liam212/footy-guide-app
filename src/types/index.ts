export interface Sport {
  id: number
  name: string
  description?: string
  logo_url?: string
  created_at?: string
}

export interface Channel {
  id: number
  name: string
  broadcaster_id?: number
  primary_color?: string
  secondary_color?: string
  text_color?: string
}

export interface ChannelResponse {
  id: number
  name: string
  broadcaster_id?: number
  primary_color?: string
  secondary_color?: string
  text_color?: string
}

export interface BroadcasterResponse {
  id: number
  name: string
  logo_url?: string
  site_url?: string
  primary_color?: string
  secondary_color?: string
  text_color?: string
}

export interface Country {
  id: number
  name: string
  fifa_code?: string
  iso_code?: string
}

export interface Team {
  id: number
  name: string
  short_name?: string
  logo_url?: string
}

export interface Competition {
  id: number
  sport_id: number
  country_id?: number
  name: string
  tier?: number
  logo_url?: string
}

export interface CompetitionResponse {
  id: number
  name: string
  country?: string
}

export interface Match {
  id: number
  sport_id: number
  competition: Competition
  home_team: Team
  away_team?: Team
  date: string
  time?: string
  tags: string[]
  channels: Channel[]
}

export interface Filters {
  competitions: Array<{ [key: string]: number | string | null }>
  channels: ChannelResponse[]
  countries: Array<{ [key: string]: number | string | null }>
}

export interface MatchesWithFilters {
  matches: Match[]
  filters: Filters
}
