import React from 'react'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import ImageGenerator from "./pages/ImageGenerator"
import SingleImageView from "./components/SingleImageView"
import { SupabaseAuthProvider } from '@/integrations/supabase/auth'
import { NotificationProvider } from './contexts/NotificationContext'
import '@/styles/shadcn-overrides.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <SupabaseAuthProvider>
          <NotificationProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ImageGenerator />} />
                <Route path="/image/:imageId" element={<SingleImageView />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </SupabaseAuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App