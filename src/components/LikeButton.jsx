import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { createNotification } from '@/utils/notificationTemplates';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/supabase';

const LikeButton = ({ isLiked, onToggle, className, imageOwnerId, imageUrl }) => {
  const { session } = useSupabaseAuth();

  const handleLike = async (e) => {
    e.stopPropagation();
    onToggle();

    if (!isLiked && imageOwnerId && imageOwnerId !== session?.user?.id) {
      try {
        await createNotification(imageOwnerId, 'IMAGE_LIKED', {
          likerName: session.user.user_metadata.display_name || session.user.email,
          likerAvatar: session.user.user_metadata.avatar_url,
          imageUrl: supabase.storage.from('user-images').getPublicUrl(imageUrl).data.publicUrl,
        });
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6 p-0", className)}
      onClick={handleLike}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isLiked ? "fill-red-500 text-red-500" : "text-foreground"
        )} 
      />
    </Button>
  );
};

export default LikeButton;