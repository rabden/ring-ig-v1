import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export const AuthUI = ({ buttonText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setError(error.message || 'Failed to sign in with Google');
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        className="w-full bg-white hover:bg-zinc-50 text-black border border-border h-10 md:h-12 text-sm md:text-base"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
        ) : (
          <FcGoogle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
        )}
        {buttonText || "Continue with Google"}
      </Button>

      {error && (
        <div className="mt-3 md:mt-4 text-xs md:text-sm text-destructive text-center">
          {error}
        </div>
      )}
    </div>
  );
};
