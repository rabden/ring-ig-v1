import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  
  if (loading) return <LoadingScreen />;
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Auth Route Component (for login page)
const AuthRoute = ({ children }) => {
  const { session, loading } = useSupabaseAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (session) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

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
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <NotificationProvider>
              {isLoading && <LoadingScreen />}
              <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/image/:imageId" element={<SingleImageView />} />
                  
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
              </div>
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;