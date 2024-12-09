import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGroup = ({ title, images, onImageClick, onDownload, onDiscard, onRemix, onViewDetails }) => {
  if (!images?.length) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 px-2 text-foreground/80">{title}</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="bg-clip-padding px-2"
      >
        {images.map((image, index) => (
          <div key={image.id} className="mb-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                <img 
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt} 
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onImageClick(index)}
                />
              </CardContent>
            </Card>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm truncate w-[70%] mr-2 text-foreground/80">{image.prompt}</p>
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
            <p className="text-xs text-foreground/60 px-1 mt-1">
              {format(parseISO(image.created_at), 'MMM d, h:mm a')}
            </p>
          </div>
        ))}
      </Masonry>
    </div>
  )
}

const MyImages = ({ userId, onImageClick, onDownload, onDiscard, onRemix, onViewDetails }) => {
  const { data: userImages, isLoading } = useQuery({
    queryKey: ['userImages', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })

  const groupedImages = useMemo(() => {
    if (!userImages) return {}

    return userImages.reduce((acc, image) => {
      const date = parseISO(image.created_at)
      let group = 'Earlier'

      if (isToday(date)) {
        group = 'Today'
      } else if (isThisWeek(date)) {
        group = 'This Week'
      } else if (isThisMonth(date)) {
        group = 'This Month'
      }

      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(image)
      return acc
    }, {})
  }, [userImages])

  if (isLoading) {
    return <div className="flex items-center justify-center h-[200px]">Loading...</div>
  }

  return (
    <div className="space-y-2">
      <ImageGroup 
        title="Today" 
        images={groupedImages['Today']} 
        onImageClick={onImageClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
      />
      <ImageGroup 
        title="This Week" 
        images={groupedImages['This Week']}
        onImageClick={onImageClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
      />
      <ImageGroup 
        title="This Month" 
        images={groupedImages['This Month']}
        onImageClick={onImageClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
      />
      <ImageGroup 
        title="Earlier" 
        images={groupedImages['Earlier']}
        onImageClick={onImageClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
      />
    </div>
  )
}

export default MyImages