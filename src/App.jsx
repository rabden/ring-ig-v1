import React from 'react'
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import ImageGenerator from "./pages/ImageGenerator"
import Documentation from "./pages/Documentation"
import SingleImageView from "./components/SingleImageView"
import Login from "./pages/Login"
import { SupabaseAuthProvider, useSupabaseAuth } from '@/integrations/supabase/auth'
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

const RequireAuth = ({ children }) => {
  const { session } = useSupabaseAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={
      <RequireAuth>
        <ImageGenerator />
      </RequireAuth>
    } />
    <Route path="/docs" element={<Documentation />} />
    <Route path="/image/:imageId" element={
      <RequireAuth>
        <SingleImageView />
      </RequireAuth>
    } />
    <Route path="/remix/:imageId" element={
      <RequireAuth>
        <ImageGenerator />
      </RequireAuth>
    } />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <BrowserRouter>
          <SupabaseAuthProvider>
            <NotificationProvider>
              <Toaster />
              <AppRoutes />
            </NotificationProvider>
          </SupabaseAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App