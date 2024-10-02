import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import ImageGenerator from "./pages/ImageGenerator"
import { SupabaseAuthProvider } from '@/integrations/supabase/auth'
import QueueProcessor from './components/QueueProcessor'

const queryClient = new QueryClient()

const App = () => (
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
          <QueueProcessor />
        </SupabaseAuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App