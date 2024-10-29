import React from 'react'
import { Drawer } from 'vaul'
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Trash2, Copy, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/integrations/supabase/supabase'
import { styleConfigs } from '@/utils/styleConfigs'
import { toast } from 'sonner'
import { modelConfigs } from '@/utils/modelConfigs'
import { useQuery } from '@tanstack/react-query'

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

  const detailItems = [
    { label: "Model", value: modelConfigs[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  const { data: similarImages } = useQuery({
    queryKey: ['similarImages', image.id, nsfwEnabled],
    queryFn: async () => {
      if (!showImage) return [];
      
      let query = supabase
        .from('user_images')
        .select('*')
        .neq('id', image.id)
        .textSearch('prompt', image.prompt, {
          type: 'plain',
          config: 'english'
        })
        .limit(20);

      // Filter images based on NSFW setting
      if (nsfwEnabled) {
        query = query.filter('model', 'in', ['nsfwMaster', 'animeNsfw', 'nsfwPro']);
      } else {
        query = query.filter('model', 'in', ['turbo', 'flux', 'fluxDev', 'preLar']);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: open && showImage
  });

  const handleAction = (action) => {
    onOpenChange(false);
    setTimeout(() => action(), 300);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied to clipboard');
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
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleAction(() => onDownload(
                    supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl,
                    image.prompt
                  ))}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleAction(() => onRemix(image))}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Remix
                </Button>
                {isOwner && (
                  <Button
                    variant="destructive"
                    className="w-full col-span-2"
                    onClick={() => handleAction(() => onDiscard(image))}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Discard
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Prompt</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={handleCopyPrompt}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {image.prompt}
                  </p>
                </div>
                <Separator className="bg-border/50" />
                <div className="grid grid-cols-2 gap-4">
                  {detailItems.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <Badge variant="secondary" className="text-sm font-normal">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>

                {showImage && similarImages && similarImages.length > 0 && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Similar Images</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {similarImages.map((similarImage) => (
                          <div key={similarImage.id} className="relative rounded-lg overflow-hidden" style={{ paddingTop: '100%' }}>
                            <img
                              src={supabase.storage.from('user-images').getPublicUrl(similarImage.storage_path).data.publicUrl}
                              alt={similarImage.prompt}
                              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                              onClick={() => {
                                onOpenChange(false);
                                setTimeout(() => onImageClick(similarImage), 300);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
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