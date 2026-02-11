import { createMemoryHistory, createRouter } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

export function createAppRouter({
  queryClient,
  history,
}: {
  queryClient: QueryClient
  history?: ReturnType<typeof createMemoryHistory>
}) {
  return createRouter({
    routeTree,
    context: { queryClient },
    history,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
}
