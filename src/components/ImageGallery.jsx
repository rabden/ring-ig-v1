import React from 'react'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from '@/integrations/supabase/supabase'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
};

const SkeletonImageCard = () => (
  <div className="mb-4">
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative" style={{ paddingTop: '100%' }}>
        <Skeleton className="absolute inset-0 w-full h-full" />
      </CardContent>
    </Card>
    <div className="mt-2 flex items-center justify-between">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
)

const ImageGallery = ({ images, isLoading, isGenerating, onImageClick, onDownload, onDiscard, onRemix, onViewDetails }) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto"
      columnClassName="bg-clip-padding px-2"
    >
      {isGenerating && <SkeletonImageCard />}
      {isLoading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <SkeletonImageCard key={index} />
        ))
      ) : (
        images?.map((image, index) => (
          <div key={image.id} className="mb-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                <img 
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt} 
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  onClick={() => onImageClick(index)}
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
                  <DropdownMenuItem onClick={() => onDiscard(image.id)}>
                    Discard
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
        ))
      )}
    </Masonry>
  )
}

export default ImageGallery