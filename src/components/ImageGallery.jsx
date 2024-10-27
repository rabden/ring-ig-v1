import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, RefreshCcw, Trash2, Info } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

const ImageGallery = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails, 
  activeView, 
  generatingImages,
  nsfwEnabled 
}) => {
  const { data: images, isLoading } = useQuery({
    queryKey: ['images', userId, activeView],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const filteredImages = images?.filter(image => {
    const isNsfw = ['nsfwMaster', 'animeNsfw'].includes(image.model);
    return nsfwEnabled ? isNsfw : !isNsfw;
  });

  const renderImageActions = (image) => (
    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
      <Button
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDownload(image.url, image.prompt);
        }}
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onRemix(image);
        }}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDiscard(image);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(image);
        }}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderLoadingSkeletons = () => (
    Array(4).fill(0).map((_, index) => (
      <Card key={index} className="relative group overflow-hidden">
        <AspectRatio ratio={1}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
      </Card>
    ))
  );

  const renderGeneratingSkeletons = () => (
    generatingImages.map((genImage, index) => (
      <Card key={`generating-${index}`} className="relative group overflow-hidden">
        <AspectRatio ratio={genImage.width / genImage.height}>
          <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Generating...</p>
          </div>
        </AspectRatio>
      </Card>
    ))
  );

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {renderGeneratingSkeletons()}
        {isLoading ? renderLoadingSkeletons() : (
          filteredImages?.map((image) => (
            <Card
              key={image.id}
              className="relative group overflow-hidden cursor-pointer"
              onClick={() => onImageClick(image)}
            >
              <AspectRatio ratio={image.width / image.height}>
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              {renderImageActions(image)}
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ImageGallery;
