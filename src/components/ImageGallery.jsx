import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SkeletonImageCard from './SkeletonImageCard'
import { modelConfigs } from '@/utils/modelConfigs'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGallery = ({ userId, onImageClick, onDownload, onDiscard, onRemix, onViewDetails, activeView, generatingImages = [], nsfwEnabled }) => {
  const [images, setImages] = useState([])

  const { isLoading } = useQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      
      // Fetch profile information separately
      const userIds = [...new Set(data.map(img => img.user_id))]
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .in('id', userIds)
      if (profilesError) throw profilesError

      // Combine image data with profile information
      const imagesWithProfiles = data.map(img => ({
        ...img,
        profile: profiles.find(p => p.id === img.user_id)
      }))

      const filteredData = imagesWithProfiles.filter(img => {
        const isNsfw = modelConfigs[img.model]?.category === "NSFW";
        return (activeView === 'myImages' && img.user_id === userId && (nsfwEnabled || !isNsfw)) ||
               (activeView === 'inspiration' && img.user_id !== userId && (nsfwEnabled || !isNsfw));
      });
      setImages(filteredData);
      return filteredData;
    },
    enabled: !!userId,
  })

  useEffect(() => {
    const subscription = supabase
      .channel('user_images_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_images' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setImages((prevImages) => {
            const isNsfw = modelConfigs[payload.new.model]?.category === "NSFW";
            if (activeView === 'myImages' && payload.new.user_id === userId && (nsfwEnabled || !isNsfw)) {
              return [payload.new, ...prevImages]
            } else if (activeView === 'inspiration' && payload.new.user_id !== userId && (nsfwEnabled || !isNsfw)) {
              return [payload.new, ...prevImages]
            }
            return prevImages
          })
        } else if (payload.eventType === 'DELETE') {
          setImages((prevImages) => prevImages.filter(img => img.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, activeView, nsfwEnabled])

  const renderContent = () => {
    const content = []

    if (activeView === 'myImages' && generatingImages && generatingImages.length > 0) {
      content.push(...generatingImages.map((img, index) => (
        <SkeletonImageCard key={`generating-${index}`} width={img.width} height={img.height} />
      )))
    }

    if (isLoading) {
      content.push(...Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      )))
    } else if (images && images.length > 0) {
      content.push(...images.map((image, index) => (
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
            {activeView === 'inspiration' && (
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={image.profile?.avatar_url} />
                <AvatarFallback>{image.user_id.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <p className={`text-sm truncate ${activeView === 'inspiration' ? 'w-[50%]' : 'w-[70%]'} mr-2`}>{image.prompt}</p>
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
      )))
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
