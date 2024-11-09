import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Link } from 'react-router-dom';
import ProfileAvatar from './profile/ProfileAvatar';

const ImageDetailsDialog = ({ open, onOpenChange, image }) => {
  const { data: owner } = useQuery({
    queryKey: ['profile', image?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', image.user_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!image?.user_id,
  });

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh]">
        <ScrollArea className="h-full pr-4">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="w-full h-auto"
            />
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Link to={`/profile/${image.user_id}`} className="flex items-center gap-2">
              <ProfileAvatar user={owner} size="sm" />
              <span className="text-sm font-medium">{owner?.display_name}</span>
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Prompt</h3>
            <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
              {image.prompt}
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;