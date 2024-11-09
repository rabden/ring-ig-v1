import React from 'react';
import { Drawer } from 'vaul';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ProfileAvatar from './profile/ProfileAvatar';

const MobileImageDrawer = ({ 
  open, 
  onOpenChange, 
  image, 
  showFullImage = true,
  onDownload,
  onRemix,
  isOwner,
  setActiveTab,
  setStyle,
}) => {
  const { data: owner } = useQuery({
    queryKey: ['profile', image.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', image.user_id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 mt-24 rounded-t-[10px] flex flex-col">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted my-4" />
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="px-4 pb-8">
              {showFullImage && (
                <div className="relative rounded-lg overflow-hidden mb-4">
                  <img
                    src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                    alt={image.prompt}
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-6">
                <Link to={`/profile/${image.user_id}`} className="flex items-center gap-2">
                  <ProfileAvatar user={owner} size="sm" />
                  <span className="text-sm font-medium">{owner?.display_name}</span>
                </Link>
              </div>

              <div className="flex gap-2 justify-between mb-6">
                <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {!isOwner && (
                  <Button variant="outline" size="sm" className="flex-1" onClick={onRemix}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Prompt</h3>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
                  {image.prompt}
                </p>
              </div>
            </div>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileImageDrawer;