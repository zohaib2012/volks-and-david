import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { ThemeProvider } from './components/theme/ThemeProvider'
import './i18n'
import './globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)
