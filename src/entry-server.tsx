import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { RouterProvider } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from '@tanstack/react-query'
import { createMemoryHistory } from '@tanstack/react-router'
import { createAppRouter } from './router'

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 10,
      },
    },
  })

  const history = createMemoryHistory({ initialEntries: [url] })
  const router = createAppRouter({ queryClient, history })

  await router.load()

  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )

  return {
    html,
    state: dehydrate(queryClient),
  }
}
