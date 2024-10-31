import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignIn = () => {
  const { session } = useSupabaseAuth();

  // If user is already signed in, redirect to home
  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <SupabaseAuthUI />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;