import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const Inspiration = ({ userId }) => {
  const { data: inspirationImages, isLoading } = useQuery({
    queryKey: ['inspirationImages', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .neq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)  // Limit to 50 images for performance
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto"
      columnClassName="bg-clip-padding px-2"
    >
      {inspirationImages?.map((image) => (
        <div key={image.id} className="mb-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
              <img 
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </CardContent>
          </Card>
          <p className="mt-2 text-sm truncate">{image.prompt}</p>
        </div>
      ))}
    </Masonry>
  )
}

export default Inspiration