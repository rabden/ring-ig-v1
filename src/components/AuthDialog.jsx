import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SupabaseAuthUI } from '@/integrations/supabase/auth';
import { ScrollArea } from "@/components/ui/scroll-area";

const AuthDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[90vh] sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-100px)] sm:max-h-none">
          <div className="p-4">
            <SupabaseAuthUI />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;