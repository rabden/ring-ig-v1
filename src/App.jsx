import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/integrations/supabase/components/AuthProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useState, useEffect } from 'react';
import ImageGenerator from '@/pages/ImageGenerator';
import SingleImageView from '@/components/SingleImageView';
import PublicProfile from '@/pages/PublicProfile';
import LoadingScreen from '@/components/LoadingScreen';
import Login from '@/pages/Login';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

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
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <ImageGenerator />
                    </ProtectedRoute>
                  } />
                  <Route path="/image/:imageId" element={
                    <ProtectedRoute>
                      <SingleImageView />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/:userId" element={
                    <ProtectedRoute>
                      <PublicProfile />
                    </ProtectedRoute>
                  } />
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