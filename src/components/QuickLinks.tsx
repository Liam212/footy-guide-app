import { Link, useRouterState } from '@tanstack/react-router'

const quickLinks = [
  { label: 'England', to: '/c/england' },
  { label: 'Premier League', to: '/c/england/comp/premier-league' },
  { label: 'Championship', to: '/c/england/comp/championship' },
  { label: 'League One', to: '/c/england/comp/league-one' },
  { label: 'League Two', to: '/c/england/comp/league-two' },
  { label: 'FA Cup', to: '/c/england/comp/fa-cup' },
  { label: 'League Cup', to: '/c/england/comp/league-cup' },
  { label: 'Community Shield', to: '/c/england/comp/community-shield' },
  { label: 'Sky Sports', to: '/b/sky' },
  { label: 'TNT Sports', to: '/b/tnt-sports' },
]

export function QuickLinks() {
  const date = useRouterState({
    select: state => (state.location.search as { date?: string })?.date,
  })

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
      <div className="flex flex-wrap gap-2">
        {quickLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            search={date ? { date } : undefined}
            className="inline-flex items-center rounded-full bg-white/90 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
