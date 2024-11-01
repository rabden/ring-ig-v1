import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthUI } from './components/AuthUI';
import { AuthProvider } from './components/AuthProvider';

// Send welcome notification
const sendWelcomeNotification = async (userId) => {
  await supabase.from('notifications').insert([{
    user_id: userId,
    title: "Welcome to our platform!",
    message: "Get started by exploring our documentation to learn about all the features.",
    link: "/docs",
    link_names: "View Documentation",
    is_read: false
  }]);
};

// Modify the AuthProvider to include welcome notification
const EnhancedAuthProvider = ({ children }) => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await sendWelcomeNotification(session.user.id);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
};

export { EnhancedAuthProvider as SupabaseAuthProvider };
export { useAuth as useSupabaseAuth } from './hooks/useAuth';
export { AuthUI as SupabaseAuthUI };