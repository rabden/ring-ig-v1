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
      if (!userId) return []
      
      // First, get trending and hot images
      const { data: trendingHotImages, error: trendingError } = await supabase
        .from('user_images')
        .select('*')
        .neq('user_id', userId)
        .eq('is_private', false)
        .or('is_hot.eq.true,is_trending.eq.true')
        .order('created_at', { ascending: false });

      if (trendingError) throw trendingError;

      // Then, get images from followed users
      const { data: followingImages, error: followingError } = await supabase
        .from('user_images')
        .select('*')
        .neq('user_id', userId)
        .eq('is_private', false)
        .in('user_id', following || [])
        .not('id', 'in', `(${(trendingHotImages || []).map(img => img.id).join(',') || '0'})`)
        .order('created_at', { ascending: false });

      if (followingError) throw followingError;

      // Finally, get other public images
      const { data: otherImages, error: otherError } = await supabase
        .from('user_images')
        .select('*')
        .neq('user_id', userId)
        .eq('is_private', false)
        .not('id', 'in', 
          `(${[...(trendingHotImages || []), ...(followingImages || [])]
            .map(img => img.id)
            .join(',') || '0'})`
        )
        .order('created_at', { ascending: false })
        .limit(30);

      if (otherError) throw otherError;

      // Combine all images in the desired order
      return [
        ...(trendingHotImages || []),
        ...(followingImages || []),
        ...(otherImages || [])
      ];
    },
    enabled: !!userId,
  })

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
  )
}

export default Inspiration