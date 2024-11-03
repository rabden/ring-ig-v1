import React, { useState, useEffect } from 'react'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import ImageGenerator from "./pages/ImageGenerator"
import Documentation from "./pages/Documentation"
import SingleImageView from "./components/SingleImageView"
import UserProfile from "./components/profile/UserProfile"
import { SupabaseAuthProvider, useSupabaseAuth } from '@/integrations/supabase/auth'
import { NotificationProvider } from './contexts/NotificationContext'
import LoadingScreen from './components/LoadingScreen'
import AuthOverlay from './components/AuthOverlay'
import '@/styles/shadcn-overrides.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {!session && <AuthOverlay />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ImageGenerator />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/image/:imageId" element={<SingleImageView />} />
          <Route path="/remix/:imageId" element={<ImageGenerator />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <SupabaseAuthProvider>
          <NotificationProvider>
            <Toaster />
            <AppContent />
          </NotificationProvider>
        </SupabaseAuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App