import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import SkeletonImageCard from './SkeletonImageCard'
import { modelConfigs } from '@/utils/modelConfigs'
import MobileImageDrawer from './MobileImageDrawer'
import ImageCard from './ImageCard'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGallery = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails, 
  activeView, 
  generatingImages = [], 
  nsfwEnabled 
}) => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showImageInDrawer, setShowImageInDrawer] = useState(false)

  const { isLoading, refetch } = useQuery({
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
        
        if (activeView === 'myImages') {
          if (nsfwEnabled) {
            return img.user_id === userId && isNsfw;
          } else {
            return img.user_id === userId && !isNsfw;
          }
        } else if (activeView === 'inspiration') {
          if (nsfwEnabled) {
            return img.user_id !== userId && isNsfw;
          } else {
            return img.user_id !== userId && !isNsfw;
          }
        }
        return false;
      });

      setImages(filteredData);
      return filteredData;
    },
    enabled: !!userId,
  })

  useEffect(() => {
    refetch()
  }, [activeView, nsfwEnabled, refetch])

  useEffect(() => {
    const subscription = supabase
      .channel('user_images_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_images' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setImages((prevImages) => {
            const isNsfw = modelConfigs[payload.new.model]?.category === "NSFW";
            if (activeView === 'myImages') {
              if (nsfwEnabled) {
                return isNsfw && payload.new.user_id === userId ? [payload.new, ...prevImages] : prevImages;
              } else {
                return !isNsfw && payload.new.user_id === userId ? [payload.new, ...prevImages] : prevImages;
              }
            } else if (activeView === 'inspiration') {
              if (nsfwEnabled) {
                return isNsfw && payload.new.user_id !== userId ? [payload.new, ...prevImages] : prevImages;
              } else {
                return !isNsfw && payload.new.user_id !== userId ? [payload.new, ...prevImages] : prevImages;
              }
            }
            return prevImages;
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

  const renderContent = () => {
    const content = []

    if (activeView === 'myImages' && generatingImages && generatingImages.length > 0) {
      content.push(...generatingImages.map((img) => (
        <SkeletonImageCard key={img.id} width={img.width} height={img.height} />
      )))
    }

    if (isLoading) {
      content.push(...Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      )))
    } else if (images && images.length > 0) {
      content.push(...images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          onImageClick={() => handleImageClick(image, index)}
          onMoreClick={handleMoreClick}
          onDownload={onDownload}
          onDiscard={onDiscard}
          onRemix={onRemix}
          onViewDetails={onViewDetails}
          userId={userId}
          isMobile={window.innerWidth <= 768}
        />
      )))
    }

    return content
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {renderContent()}
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