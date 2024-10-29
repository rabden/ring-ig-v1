import React from 'react'
import { Drawer } from 'vaul'
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/integrations/supabase/supabase'
import { styleConfigs } from '@/utils/styleConfigs'
import { modelConfigs } from '@/utils/modelConfigs'
import { useQuery } from '@tanstack/react-query'
import { findCommonWords } from '@/utils/textUtils'
import Masonry from 'react-masonry-css'
import ImageActions from './drawer/ImageActions'
import ImagePrompt from './drawer/ImagePrompt'
import ImageDetails from './drawer/ImageDetails'
import SimilarImages from './drawer/SimilarImages'

const MobileImageDrawer = ({ 
  open, 
  onOpenChange, 
  image, 
  showImage = false,
  onDownload,
  onDiscard,
  onRemix,
  onImageClick,
  isOwner = false,
  nsfwEnabled = false
}) => {
  if (!image) return null;

  const { data: similarImages } = useQuery({
    queryKey: ['similarImages', image.id, nsfwEnabled],
    queryFn: async () => {
      if (!showImage) return [];
      
      const allowedModels = nsfwEnabled 
        ? ['nsfwMaster', 'animeNsfw', 'nsfwPro']
        : ['turbo', 'flux', 'fluxDev', 'preLar'];

      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .neq('id', image.id)
        .in('model', allowedModels)
        .limit(50);

      if (error) throw error;

      const filteredData = data.filter(img => findCommonWords(img.prompt, image.prompt));
      return filteredData.slice(0, 20);
    },
    enabled: open && showImage
  });

  const handleAction = (action) => {
    onOpenChange(false);
    setTimeout(() => action(), 300);
  };

  const handleSimilarImageClick = (similarImage) => {
    onImageClick(similarImage);
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Drawer.Content className="bg-background/95 backdrop-blur-sm fixed inset-0 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Image Details</h3>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-md mx-auto space-y-6">
              {showImage && (
                <div className="mb-6 -mx-6">
                  <div className="relative rounded-lg overflow-hidden" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                    <img
                      src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                      alt={image.prompt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <ImageActions
                onDownload={() => handleAction(() => onDownload(
                  supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl,
                  image.prompt
                ))}
                onRemix={() => handleAction(() => onRemix(image))}
                onDiscard={() => handleAction(() => onDiscard(image))}
                isOwner={isOwner}
              />

              <div className="space-y-6">
                <ImagePrompt prompt={image.prompt} />
                <Separator className="bg-border/50" />
                <ImageDetails image={image} />

                {showImage && similarImages && similarImages.length > 0 && (
                  <SimilarImages
                    similarImages={similarImages}
                    onImageClick={handleSimilarImageClick}
                  />
                )}
              </div>
            </div>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileImageDrawer;