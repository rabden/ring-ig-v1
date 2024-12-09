import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import DateGroupedGallery from './DateGroupedGallery'
import { Skeleton } from './ui/skeleton'

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <DateGroupedGallery
      images={userImages}
      onImageClick={onImageClick}
      onDownload={onDownload}
      onDiscard={onDiscard}
      onRemix={onRemix}
      onViewDetails={onViewDetails}
      className="p-4"
    />
  )
}

export default MyImages