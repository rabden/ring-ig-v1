import React from 'react'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import ImageGenerator from "./pages/ImageGenerator"
import { SupabaseAuthProvider } from '@/integrations/supabase/auth'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <SupabaseAuthProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ImageGenerator />} />
              </Routes>
            </BrowserRouter>
          </SupabaseAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App