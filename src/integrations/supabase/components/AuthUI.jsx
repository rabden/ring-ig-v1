import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { PasswordInput } from './PasswordInput';

const generateRandomDisplayName = () => {
  return `User_${Math.random().toString(36).substring(2, 7)}`;
};

export const AuthUI = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting sign in with:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) throw error;
      
      if (!data?.session) {
        throw new Error('No session after sign in');
      }
      
      console.log('Sign in successful:', data);
      // Reset form
      setEmail('');
      setPassword('');
      setShowEmailForm(false);
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError(error.message || 'Failed to sign in');
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const finalDisplayName = generateRandomDisplayName();
      console.log('Attempting sign up with:', { email });
      
      const baseUrl = window.location.origin;
      const redirectTo = `${baseUrl}/auth/callback`;
      
      console.log('Using redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: finalDisplayName,
          },
          emailRedirectTo: redirectTo,
        },
      });
      
      if (error) throw error;

      console.log('Sign up response:', data);
      
      if (data?.user?.identities?.length === 0) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      
      // If email confirmation is required
      if (!data.session && data.user) {
        console.log('Email confirmation required, confirmation email sent to:', email);
        setShowConfirmation(true);
        // Reset form
        setEmail('');
        setPassword('');
      } else if (data.session) {
        // Auto sign-in case (if email confirmation is not required)
        console.log('Auto sign-in successful');
        setShowEmailForm(false);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.message.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.');
        setIsSignIn(true); // Switch to sign in mode
      } else {
        setError(error.message || 'Failed to sign up');
      }
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

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
      
      console.log('Google sign in initiated:', data);
      // No need to reset form as we're being redirected
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setError(error.message || 'Failed to sign in with Google');
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setShowEmailForm(false);
    setIsSignIn(false);
  };

  if (showConfirmation) {
    return (
      <div className="space-y-4 text-center p-6">
        <h2 className="text-2xl font-semibold">Check your email</h2>
        <p className="text-muted-foreground">
          We've sent a confirmation link to <span className="font-medium">{email}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Click the link in your email to complete your registration
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full relative" 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        {!showEmailForm && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowEmailForm(true)}
          >
            Continue with Email
          </Button>
        )}
      </div>

      {showEmailForm && (
        <>
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (isSignIn) {
                handleEmailSignIn(e);
              } else {
                handleEmailSignUp(e);
              }
            }} 
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                placeholder={isSignIn ? "Enter your password" : "Create a secure password"}
                autoComplete={isSignIn ? "current-password" : "new-password"}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isSignIn ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            {isSignIn ? (
              <p className="text-muted-foreground">
                Don't have an account yet?{' '}
                <button
                  onClick={() => setIsSignIn(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignIn(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
