import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFollows } from '@/hooks/useFollows'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const Inspiration = ({ userId, onImageClick, onDownload, onRemix, onViewDetails }) => {
  const { following } = useFollows(userId);

  const { data: inspirationImages, isLoading } = useQuery({
    queryKey: ['inspirationImages', userId, following],
    queryFn: async () => {
      if (!userId) return [];

      // Fetch all public images that aren't the user's own
      const { data: allImages, error } = await supabase
        .from('user_images')
        .select('*')
        .neq('user_id', userId)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!allImages) return [];

      // Separate images into categories
      const trendingHotImages = allImages.filter(img => img.is_trending || img.is_hot);
      const followingImages = allImages.filter(img => 
        following?.includes(img.user_id) && 
        !trendingHotImages.some(t => t.id === img.id)
      );
      const otherImages = allImages.filter(img => 
        !trendingHotImages.some(t => t.id === img.id) && 
        !followingImages.some(f => f.id === img.id)
      ).slice(0, 30); // Limit other images to 30

      // Sort trending/hot images to prioritize those that are both
      const sortedTrendingHot = trendingHotImages.sort((a, b) => {
        if (a.is_hot && a.is_trending && (!b.is_hot || !b.is_trending)) return -1;
        if (b.is_hot && b.is_trending && (!a.is_hot || !a.is_trending)) return 1;
        if (a.is_hot && !b.is_hot) return -1;
        if (b.is_hot && !a.is_hot) return 1;
        if (a.is_trending && !b.is_trending) return -1;
        if (b.is_trending && !a.is_trending) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // Combine all categories in the desired order
      return [...sortedTrendingHot, ...followingImages, ...otherImages];
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto"
      columnClassName="bg-clip-padding px-2"
    >
      {inspirationImages?.map((image, index) => (
        <div key={image.id} className="mb-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
              <img 
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt} 
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onClick={() => onImageClick(index)}
              />
              {(image.is_hot || image.is_trending) && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {image.is_hot && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Hot</span>
                  )}
                  {image.is_trending && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Trending</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm truncate w-[70%] mr-2">{image.prompt}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}>
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRemix(image)}>
                  Remix
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails(image)}>
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </Masonry>
  );
};

export default Inspiration;