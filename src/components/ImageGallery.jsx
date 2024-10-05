import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SkeletonImageCard from './SkeletonImageCard'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGallery = ({ userId, onImageClick, onDownload, onDiscard, onRemix, onViewDetails, activeView, isGeneratingImage, generatingImageSize }) => {
  const [skeletonDimensions, setSkeletonDimensions] = useState({ width: 512, height: 512 })

  useEffect(() => {
    if (isGeneratingImage) {
      setSkeletonDimensions(generatingImageSize)
    }
  }, [isGeneratingImage])

  const { data: images, isLoading } = useQuery({
    queryKey: ['images', userId, activeView],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return activeView === 'myImages' 
        ? data.filter(img => img.user_id === userId)
        : data.filter(img => img.user_id !== userId)
    },
    enabled: !!userId,
  })

  const renderContent = () => {
    const content = []

    if (isGeneratingImage && activeView === 'myImages') {
      content.push(
        <SkeletonImageCard key="generating" width={skeletonDimensions.width} height={skeletonDimensions.height} />
      )
    }

    if (isLoading) {
      content.push(...Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={skeletonDimensions.width} height={skeletonDimensions.height} />
      )))
    } else {
      content.push(...(images?.map((image, index) => (
        <div key={image.id} className="mb-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
              <img 
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt} 
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onClick={() => onImageClick(image, index)}
              />
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
                {activeView === 'myImages' && onDiscard && (
                  <DropdownMenuItem onClick={() => onDiscard(image)}>
                    Discard
                  </DropdownMenuItem>
                )}
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
      )) || []))
    }

    return content
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto"
      columnClassName="bg-clip-padding px-2"
    >
      {renderContent()}
    </Masonry>
  )
}

export default ImageGallery