import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseAuthProvider } from '@/integrations/supabase/auth';
import { NotificationProvider } from './contexts/NotificationContext';
import ImageGenerator from './pages/ImageGenerator';
import Documentation from './pages/Documentation';
import SingleImageView from './components/SingleImageView';
import '@/styles/shadcn-overrides.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      suspense: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <SupabaseAuthProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<ImageGenerator />} />
                  <Route path="/docs" element={<Documentation />} />
                  <Route path="/image/:imageId" element={<SingleImageView />} />
                  <Route path="/remix/:imageId" element={<ImageGenerator />} />
                </Routes>
                <Toaster />
              </BrowserRouter>
            </NotificationProvider>
          </SupabaseAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;