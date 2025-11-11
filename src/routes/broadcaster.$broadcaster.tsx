import { createFileRoute } from '@tanstack/react-router'
import isNumeric from '../helpers/isNumeric'
import { api } from '../api'
import type { Channel } from '../types'

export const Route = createFileRoute('/broadcaster/$broadcaster')({
  loader: async ({ params }) => {
    const { broadcaster } = params as { broadcaster: string }
    const isBroadcasterId = isNumeric(broadcaster)
    if (isBroadcasterId) {
      const res = await api.get(
        `/channels?broadcaster_id=${parseInt(broadcaster)}`,
      )
      if (res.status === 200) return res.data
    } else {
      const res = await api.get(`/broadcasters?name=${broadcaster}`)
      if (res.status === 200) return res.data
    }

    return null
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No broadcaster found.
      </div>
    )
  }

  const { broadcaster, channels } = data

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* ─── Broadcaster Header ─────────────────────────────── */}
        <div
          className="rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 transition"
          style={{
            background: `linear-gradient(135deg, ${
              broadcaster.primary_color || '#1e293b'
            }, ${broadcaster.secondary_color || '#334155'})`,
            color: broadcaster.text_color || '#fff',
          }}>
          {broadcaster.logo_url && (
            <img
              src={broadcaster.logo_url}
              alt={broadcaster.name}
              className="w-24 h-24 rounded-xl bg-white/20 p-2 object-contain"
            />
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">{broadcaster.name}</h1>
            {broadcaster.site_url && (
              <a
                href={broadcaster.site_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline opacity-90 hover:opacity-100">
                Visit Site ↗
              </a>
            )}
          </div>
        </div>

        {/* ─── Channels Section ─────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Channels</h2>

          {channels.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {channels.map((ch: Channel) => (
                <div
                  key={ch.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
                  <h3 className="text-lg font-semibold mb-1">{ch.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Channel ID: {ch.id}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{
                        backgroundColor: ch.primary_color || '#ccc',
                        borderColor: ch.primary_color || '#ccc',
                      }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      Brand Color
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No channels found for this broadcaster.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
