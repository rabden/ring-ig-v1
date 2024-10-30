import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import ImageEditList from '@/components/ImageEditList'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import AuthOverlay from '@/components/AuthOverlay'
import { ScrollArea } from "@/components/ui/scroll-area"

const ImageEdit = () => {
  const { session } = useSupabaseAuth()

  const { data: images, isLoading } = useQuery({
    queryKey: ['allImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  if (!session) {
    return <AuthOverlay />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Image Management</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <ImageEditList images={images} isLoading={isLoading} />
      </ScrollArea>
    </div>
  )
}

export default ImageEdit