import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { AuthUI } from '@/integrations/supabase/components/AuthUI';
import LoadingScreen from '@/components/LoadingScreen';

const Login = () => {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Auth state changed:', { session, loading });
    if (session) {
      const from = location.state?.from?.pathname || '/';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Showcase */}
      <div className="hidden md:flex flex-col w-1/2 bg-[#0A2A36] text-white relative">
        <div className="flex flex-col h-full p-12">
          {/* Image Section */}
          <div className="flex-grow flex items-center justify-center mb-8">
            <div className="w-full max-w-md aspect-square relative overflow-hidden rounded-lg">
              <img
                src="/login-showcase.png"
                alt="Feature showcase"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Gradient overlay for image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A2A36]/30" />
            </div>
          </div>
          
          {/* Text Section */}
          <div className="text-center space-y-4">
            <h4 className="text-xl font-semibold">
              Create amazing images with AI
            </h4>
            <p className="text-sm text-gray-300">
              Sign in with Google to start creating
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth UI */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome to Ring</h2>
            <p className="text-sm text-muted-foreground">
              Sign in with your Google account to continue
            </p>
          </div>
          <AuthUI />
        </div>
      </div>
    </div>
  );
};

export default Login;