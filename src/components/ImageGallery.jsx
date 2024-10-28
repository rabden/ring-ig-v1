import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import MobileImageDrawer from './MobileImageDrawer'
import { modelConfigs } from '@/utils/modelConfigs'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGallery = ({ userId, onImageClick, onDownload, onDiscard, onRemix, onViewDetails, activeView, generatingImages = [], nsfwEnabled }) => {
  const [images, setImages] = React.useState([])
  const [selectedImage, setSelectedImage] = React.useState(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [showImageInDrawer, setShowImageInDrawer] = React.useState(false)

  const { refetch } = useQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const filteredData = data.filter(img => {
        const isNsfw = modelConfigs[img.model]?.category === "NSFW";
        return (activeView === 'myImages' && img.user_id === userId && (nsfwEnabled || !isNsfw)) ||
               (activeView === 'inspiration' && img.user_id !== userId && (nsfwEnabled || !isNsfw));
      });

      setImages(filteredData);
      return filteredData;
    },
    enabled: !!userId,
  })

  React.useEffect(() => {
    refetch()
  }, [activeView, nsfwEnabled, refetch])

  React.useEffect(() => {
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

  const handleImageClick = (image, index) => {
    if (window.innerWidth <= 768) {
      setSelectedImage(image)
      setShowImageInDrawer(true)
      setDrawerOpen(true)
    } else {
      onImageClick(image, index)
    }
  }

  const handleMoreClick = (image, e) => {
    e.stopPropagation()
    if (window.innerWidth <= 768) {
      setSelectedImage(image)
      setShowImageInDrawer(false)
      setDrawerOpen(true)
    }
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {images?.map((image, index) => (
          <div key={image.id} className="mb-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                <img 
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt} 
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  onClick={() => handleImageClick(image, index)}
                  loading="lazy"
                />
              </CardContent>
            </Card>
            <div className="mt-0.5 flex items-center justify-between">
              <p className="text-sm truncate w-[70%] mr-2">{image.prompt}</p>
              <div className="md:hidden">
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => handleMoreClick(image, e)}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="hidden md:block">
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
          </div>
        ))}
      </Masonry>

      <MobileImageDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        image={selectedImage}
        showImage={showImageInDrawer}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        isOwner={selectedImage?.user_id === userId}
      />
    </>
  )
}

export default ImageGallery
