import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SkeletonImageCard from './SkeletonImageCard'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const IMAGES_PER_PAGE = 10

const ImageGallery = ({ userId, onImageClick, onDownload, onDiscard, onRemix, onViewDetails, activeView, generatingImages = [] }) => {
  const [images, setImages] = useState([])
  const observerTarget = useRef(null)

  const fetchImages = async ({ pageParam = 0 }) => {
    const from = pageParam * IMAGES_PER_PAGE
    const to = from + IMAGES_PER_PAGE - 1

    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    const filteredData = activeView === 'myImages' 
      ? data.filter(img => img.user_id === userId)
      : data.filter(img => img.user_id !== userId)

    return {
      data: filteredData,
      nextPage: filteredData.length === IMAGES_PER_PAGE ? pageParam + 1 : undefined,
    }
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['images', userId, activeView],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: !!userId,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const subscription = supabase
      .channel('user_images_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_images' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setImages((prevImages) => {
            if (activeView === 'myImages' && payload.new.user_id === userId) {
              return [payload.new, ...prevImages]
            } else if (activeView === 'inspiration' && payload.new.user_id !== userId) {
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
  }, [userId, activeView])

  const renderContent = () => {
    const content = []

    if (activeView === 'myImages' && generatingImages && generatingImages.length > 0) {
      content.push(...generatingImages.map((img, index) => (
        <SkeletonImageCard key={`generating-${index}`} width={img.width} height={img.height} />
      )))
    }

    if (images && images.length > 0) {
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
      )))
    }

    return content
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="bg-clip-padding px-2"
      >
        {renderContent()}
      </Masonry>
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="ml-2">Loading images...</p>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="ml-2">Loading more images...</p>
        </div>
      )}
      <div ref={observerTarget} style={{ height: '20px' }} />
    </>
  )
}

export default ImageGallery
