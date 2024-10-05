import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGallery = ({ userId, onImageClick, onRemix }) => {
  const [activeTab, setActiveTab] = useState('myImages')

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ['userImages', userId, activeTab],
    queryFn: async () => {
      if (!userId) return []
      let query = supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (activeTab === 'myImages') {
        query = query.eq('user_id', userId)
      } else {
        query = query.neq('user_id', userId)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })

  const handleDownload = (imageUrl, prompt) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${prompt.slice(0, 20)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading image:', error);
        toast.error('Failed to download image. Please try again.');
      });
  }

  const handleDiscard = async (id) => {
    if (activeTab !== 'myImages') return
    try {
      await deleteImageCompletely(id)
      refetch()
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image. Please try again.')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-start mb-4 md:hidden">
        <Button
          variant={activeTab === 'myImages' ? 'default' : 'outline'}
          onClick={() => setActiveTab('myImages')}
          className="mr-2"
        >
          My Images
        </Button>
        <Button
          variant={activeTab === 'inspiration' ? 'default' : 'outline'}
          onClick={() => setActiveTab('inspiration')}
        >
          Inspiration
        </Button>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="bg-clip-padding px-2"
      >
        {images?.map((image) => (
          <div key={image.id} className="mb-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                <img 
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt} 
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  onClick={() => onImageClick(image)}
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
                  <DropdownMenuItem onClick={() => handleDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}>
                    Download
                  </DropdownMenuItem>
                  {activeTab === 'myImages' && (
                    <DropdownMenuItem onClick={() => handleDiscard(image.id)}>
                      Discard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onRemix(image)}>
                    Remix
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  )
}

export default ImageGallery