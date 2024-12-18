import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Upload, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const EditProfileForm = ({ user, onClose }) => {
  const [displayName, setDisplayName] = useState(user.user_metadata?.display_name || '');
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const handleDisplayNameUpdate = async () => {
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      setError('');

      const { error: updateError } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (updateError) throw updateError;

      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      queryClient.invalidateQueries(['user']);
      toast.success('Display name updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating display name:', error);
      setError('Failed to update display name');
      toast.error('Failed to update display name');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      setError('');
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        toast.error('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        toast.error('File size must be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      queryClient.invalidateQueries(['user']);
      toast.success('Profile picture updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setError('Failed to update profile picture');
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label 
            htmlFor="displayName"
            className={cn(
              "text-sm font-medium",
              "text-foreground/80",
              "transition-colors duration-200"
            )}
          >
            Display Name
          </Label>
          <div className="relative">
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError('');
              }}
              placeholder="Enter your display name"
              className={cn(
                "pl-9",
                "transition-all duration-200",
                "focus:ring-2 focus:ring-primary/20",
                error && "border-destructive focus:ring-destructive/20"
              )}
            />
            <User className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2",
              "w-4 h-4 text-muted-foreground",
              "transition-colors duration-200"
            )} />
          </div>
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button 
          onClick={handleDisplayNameUpdate}
          className={cn(
            "w-full",
            "transition-all duration-200",
            "hover:bg-primary/90"
          )}
          disabled={updating || !displayName.trim()}
        >
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              {displayName.trim() ? (
                <Check className="mr-2 h-4 w-4" />
              ) : null}
              Update Display Name
            </>
          )}
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <Label 
          htmlFor="avatar"
          className={cn(
            "text-sm font-medium",
            "text-foreground/80",
            "transition-colors duration-200"
          )}
        >
          Profile Picture
        </Label>
        <div className="relative">
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={uploading}
            className={cn(
              "cursor-pointer",
              "file:mr-4 file:py-2 file:px-4",
              "file:rounded-md file:border-0",
              "file:text-sm file:font-medium",
              "file:bg-primary/10 file:text-primary",
              "hover:file:bg-primary/20",
              "transition-all duration-200"
            )}
          />
          <Upload className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "w-4 h-4",
            uploading ? "text-primary animate-pulse" : "text-muted-foreground",
            "transition-colors duration-200"
          )} />
        </div>
        <AnimatePresence mode="wait">
          {uploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "flex items-center gap-2",
                "text-sm text-muted-foreground"
              )}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading profile picture...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileForm;
