import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuthUI } from '@/integrations/supabase/components/AuthUI';

const SignInDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-[100]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Ring</DialogTitle>
          <DialogDescription className="text-center">
            Sign in with your Google account to continue
          </DialogDescription>
        </DialogHeader>
        <AuthUI />
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;