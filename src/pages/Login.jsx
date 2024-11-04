import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';

const Login = () => {
  const { session } = useSupabaseAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (session) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <SupabaseAuthUI />
      </div>
    </div>
  );
};

export default Login;