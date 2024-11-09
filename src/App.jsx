import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/integrations/supabase/components/AuthProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ImageGenerator from '@/pages/ImageGenerator';
import SingleImageView from '@/components/SingleImageView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<ImageGenerator />} />
                <Route path="/image/:imageId" element={<SingleImageView />} />
              </Routes>
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;