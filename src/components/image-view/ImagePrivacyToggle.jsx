import React from 'react';
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';
import { useQueryClient } from '@tanstack/react-query';

const ImagePrivacyToggle = ({ image, isOwner }) => {
  const queryClient = useQueryClient();

  const handleTogglePrivacy = async () => {
    if (!image?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_images')
        .update({ is_private: !image.is_private })
        .eq('id', image.id);

      if (error) throw error;

      queryClient.invalidateQueries(['userImages']);
      toast.success(`Image is now ${!image.is_private ? 'private' : 'public'}`);
    } catch (error) {
      console.error('Error updating image privacy:', error);
      toast.error('Failed to update image privacy');
    }
  };

  if (!isOwner) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleTogglePrivacy}
      className="h-8 w-8 rounded-xl hover:bg-accent/10"
      title={image.is_private ? "Private" : "Public"}
    >
      {image.is_private ? (
        <Lock className="h-4 w-4 text-foreground/80" />
      ) : (
        <Unlock className="h-4 w-4 text-foreground/80" />
      )}
    </Button>
  );
};

export default ImagePrivacyToggle;