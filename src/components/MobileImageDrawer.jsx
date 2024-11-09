import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import ProfileAvatar from './profile/ProfileAvatar';
import FollowButton from './social/FollowButton';
import FollowStats from './social/FollowStats';

const ImageHeader = ({ owner, image }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <ProfileAvatar user={{ user_metadata: { avatar_url: owner?.avatar_url } }} size="sm" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{owner?.display_name}</span>
        <FollowStats userId={image.user_id} />
      </div>
    </div>
    <FollowButton targetUserId={image.user_id} />
  </div>
);

const MobileImageDrawer = ({ 
  image, 
  modelConfigs, 
  styleConfigs, 
  onDownload, 
  onRemix 
}) => {
  return (
    <Drawer.Root defaultOpen>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background fixed inset-x-0 bottom-0 rounded-t-[10px]">
          <div className="h-full max-h-[96vh] overflow-hidden">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 my-4" />
            <ScrollArea className="h-[calc(96vh-32px)] px-4 pb-8">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt}
                  className="w-full h-auto"
                />
              </div>
              
              <ImageHeader owner={image.owner} image={image} />
              
              <div className="flex gap-2 justify-between mb-6">
                <Button variant="ghost" size="sm" className="flex-1" onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={onRemix}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Remix
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Prompt</h3>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
                    {image.prompt}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {modelConfigs?.[image.model]?.name || image.model}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Style</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {styleConfigs?.[image.style]?.name || "General"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Size</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {image.width}x{image.height}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Quality</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {image.quality}
                    </Badge>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileImageDrawer;