import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/integrations/supabase/components/AuthProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ImageGenerator from '@/pages/ImageGenerator';
import SingleImageView from '@/components/SingleImageView';
import PublicProfile from '@/pages/PublicProfile';
import UserProfile from '@/pages/UserProfile';
import LoadingScreen from '@/components/LoadingScreen';
import Login from '@/pages/Login';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import Inspiration from '@/pages/Inspiration';
import Documentation from '@/pages/Documentation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSupabaseAuth();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);
  
  // Show loading screen during initial load or auth check
  if (loading || isInitialLoad) {
    return <LoadingScreen />;
  }
  
  // Only redirect when we're sure there's no session and initial load is complete
  if (!session && !isInitialLoad) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Auth Route Component (for login page)
const AuthRoute = ({ children }) => {
  const { session, loading } = useSupabaseAuth();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  // Show loading screen during initial load or auth check
  if (loading || isInitialLoad) {
    return <LoadingScreen />;
  }
  
  // Only redirect if we have a session and initial load is complete
  if (session && !isInitialLoad) {
    const to = location.state?.from?.pathname || '/';
    return <Navigate to={to} replace />;
  }
  
  return children;
};

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time of 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <NotificationProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/image/:imageId" element={<SingleImageView />} />
                <Route path="/docs" element={<Documentation />} />
                
                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={
                    <AuthRoute>
                      <Login />
                    </AuthRoute>
                  } 
                />

                {/* Protected Routes */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <ImageGenerator />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile/:userId" 
                  element={
                    <ProtectedRoute>
                      <PublicProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/userprofile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/inspiration" 
                  element={
                    <ProtectedRoute>
                      <Inspiration />
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;