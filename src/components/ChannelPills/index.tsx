import { Link } from '@tanstack/react-router'

type Channel = {
  id: number
  name: string
  primary_color?: string
  secondary_color?: string
  text_color?: string
  broadcaster_id?: string | number | null
}

interface ChannelPillsProps {
  channels: Channel[]
  containerClassName?: string
  pillClassName?: string
  fallbackClassName?: string
}

export function ChannelPills({
  channels,
  containerClassName,
  fallbackClassName,
  pillClassName,
}: ChannelPillsProps) {
  if (!channels.length) return null

  return (
    <div className={containerClassName}>
      {channels.map(channel => {
        const style = {
          backgroundColor: channel.primary_color,
          borderColor: channel.secondary_color,
          color: channel.text_color,
        }
        return channel.broadcaster_id ? (
          <Link
            key={channel.id}
            to="/broadcaster/$broadcaster"
            params={{ broadcaster: String(channel.broadcaster_id) }}
            className={fallbackClassName}
            style={style}>
            {channel.name}
          </Link>
        ) : (
          <span key={channel.id} className={pillClassName} style={style}>
            {channel.name}
          </span>
        )
      })}
    </div>
  )
}
