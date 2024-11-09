import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ImageCard from './ImageCard'
import { useImageFilter } from '@/hooks/useImageFilter'
import { useModelConfigs } from '@/hooks/useModelConfigs'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const Inspiration = ({ userId, onImageClick, onDownload, onRemix, onViewDetails }) => {
  const { data: modelConfigs } = useModelConfigs();
  const { filterImages } = useImageFilter();

  const { data: inspirationImages, isLoading } = useQuery({
    queryKey: ['inspirationImages', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .neq('user_id', userId)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
    enabled: !!userId,
  });

  const filteredImages = filterImages(inspirationImages || [], {
    userId,
    activeView: 'inspiration',
    nsfwEnabled: false,
    modelConfigs,
    activeFilters: {},
    searchQuery: '',
    showPrivate: false
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
      {filteredImages?.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onImageClick={() => onImageClick(image)}
          onDownload={onDownload}
          onRemix={onRemix}
          onViewDetails={() => onViewDetails(image)}
          userId={userId}
        />
      ))}
    </Masonry>
  )
}

export default Inspiration