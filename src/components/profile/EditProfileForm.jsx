import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const EditProfileForm = ({ user, onClose }) => {
  const [displayName, setDisplayName] = useState(user.user_metadata?.display_name || '');
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleDisplayNameUpdate = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      toast.success('Display name updated successfully');
      queryClient.invalidateQueries(['user']);
      onClose();
    } catch (error) {
      toast.error('Failed to update display name');
      console.error('Error updating display name:', error);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      // Update profiles table
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      toast.success('Profile picture updated successfully');
      queryClient.invalidateQueries(['user']);
      onClose();
    } catch (error) {
      toast.error('Failed to update profile picture');
      console.error('Error updating profile picture:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
        />
        <Button 
          onClick={handleDisplayNameUpdate}
          className="w-full"
          variant="outline"
        >
          Update Display Name
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Picture</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={uploading}
          className="cursor-pointer"
        />
        {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      </div>
    </div>
  );
};

export default EditProfileForm;