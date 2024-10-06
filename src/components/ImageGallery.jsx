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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const IMAGES_PER_PAGE = 50

const ImageGallery = ({ userId, onImageClick, onDownload, onDiscard, onRemix, onViewDetails, activeView, generatingImages = [], nsfwEnabled }) => {
  const [images, setImages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { isLoading, refetch } = useQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled, currentPage],
    queryFn: async () => {
      if (!userId) return []
      const from = (currentPage - 1) * IMAGES_PER_PAGE
      const to = from + IMAGES_PER_PAGE - 1

      const { data, error, count } = await supabase
        .from('user_images')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      const filteredData = data.filter(img => {
        const isNsfw = modelConfigs[img.model]?.category === "NSFW";
        return (activeView === 'myImages' && img.user_id === userId && (nsfwEnabled || !isNsfw)) ||
               (activeView === 'inspiration' && img.user_id !== userId && (nsfwEnabled || !isNsfw));
      });

      setImages(filteredData);
      setTotalPages(Math.ceil(count / IMAGES_PER_PAGE));
      return filteredData;
    },
    enabled: !!userId,
  })

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when activeView or nsfwEnabled changes
    refetch() // Refetch images when activeView or nsfwEnabled changes
  }, [activeView, nsfwEnabled, refetch])

  useEffect(() => {
    const subscription = supabase
      .channel('user_images_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_images' }, (payload) => {
        if (payload.eventType === 'INSERT' && currentPage === 1) {
          setImages((prevImages) => {
            const isNsfw = modelConfigs[payload.new.model]?.category === "NSFW";
            if (activeView === 'myImages' && payload.new.user_id === userId && (nsfwEnabled || !isNsfw)) {
              return [payload.new, ...prevImages.slice(0, IMAGES_PER_PAGE - 1)]
            } else if (activeView === 'inspiration' && payload.new.user_id !== userId && (nsfwEnabled || !isNsfw)) {
              return [payload.new, ...prevImages.slice(0, IMAGES_PER_PAGE - 1)]
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
  }, [userId, activeView, nsfwEnabled, currentPage])

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
                loading="lazy" // Add lazy loading
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setImages([]) // Clear current images
    window.scrollTo(0, 0) // Scroll to top when changing pages
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
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

export default ImageGallery