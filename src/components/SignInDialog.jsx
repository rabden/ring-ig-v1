import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SupabaseAuthUI } from '@/integrations/supabase/auth';

const SignInDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In or Sign Up</DialogTitle>
        </DialogHeader>
        <SupabaseAuthUI />
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;