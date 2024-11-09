import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/integrations/supabase/components/AuthProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Index from './pages/Index';
import ImageGenerator from './pages/ImageGenerator';
import Documentation from './pages/Documentation';
import SharedImageView from './pages/SharedImageView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/create',
    element: <ImageGenerator />,
  },
  {
    path: '/remix/:imageId',
    element: <ImageGenerator />,
  },
  {
    path: '/docs',
    element: <Documentation />,
  },
  {
    path: '/image/:imageId',
    element: <SharedImageView />,
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;