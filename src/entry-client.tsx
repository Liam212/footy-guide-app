import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
  hydrate,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PostHogProvider } from 'posthog-js/react'
import { createAppRouter } from './router'

import './style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
})

const dehydratedState = (window as Window & {
  __REACT_QUERY_STATE__?: unknown
}).__REACT_QUERY_STATE__

if (dehydratedState) {
  hydrate(queryClient, dehydratedState)
}

const router = createAppRouter({ queryClient })

const rootElement = document.getElementById('root')!
const isDev = import.meta.env.NODE_ENVIROMENT === 'development'

const app = (
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: isDev ? '' : import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24',
        capture_exceptions: !isDev,
        debug: false,
      }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </QueryClientProvider>
    </PostHogProvider>
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
