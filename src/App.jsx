import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

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

// Remix Route Component
const RemixRoute = ({ children }) => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const { imageId } = useParams();
  const location = useLocation();
  const isMobileDevice = location.state?.isMobile;

  useEffect(() => {
    async function fetchAndSetupRemix() {
      if (session && imageId) {
        try {
          // Fetch the image data
          const { data: image, error } = await supabase
            .from('images')
            .select('*')
            .eq('id', imageId)
            .single();

          if (error) throw error;

          // Store the remix data with timestamp
          sessionStorage.setItem('remixData', JSON.stringify({
            prompt: image.prompt,
            model: image.model,
            quality: image.quality,
            width: image.width,
            height: image.height,
            sourceImageId: image.id,
            timestamp: Date.now()
          }));

          // Redirect based on device type
          if (isMobileDevice) {
            navigate('/#imagegenerate', { replace: true });
          } else {
            navigate('/#myimages', { replace: true });
          }
        } catch (error) {
          console.error('Error fetching image:', error);
          toast.error('Failed to load image for remix');
          navigate('/', { replace: true });
        }
      }
    }

    fetchAndSetupRemix();
  }, [session, imageId, navigate, isMobileDevice]);

  if (!session) {
    // Clear any existing remix data when not authenticated
    sessionStorage.removeItem('remixData');
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

                  {/* Remix Route */}
                  <Route 
                    path="/remix/:imageId" 
                    element={
                      <RemixRoute>
                        <ImageGenerator />
                      </RemixRoute>
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