import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { supabase } from '@/integrations/supabase/supabase';

const ProUpgradeForm = ({ open, onOpenChange }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('user_pro_requests')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user.id,
          name: data.name,
          email: data.email
        }]);

      if (error) throw error;

      onOpenChange(false);

      // Create notification for the user
      await supabase
        .from('notifications')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user.id,
          title: 'Pro Upgrade Request Received',
          message: 'We have received your request to upgrade to Pro. Our team will review it shortly.',
          is_read: false
        }]);
    } catch (error) {
      console.error('Error submitting pro request:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email', { required: true })} />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProUpgradeForm;