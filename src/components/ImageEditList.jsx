import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Switch } from "@/components/ui/switch"
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'

const ImageEditList = ({ images, isLoading }) => {
  const queryClient = useQueryClient()

  const handleToggle = async (imageId, field, currentValue) => {
    try {
      const { error } = await supabase
        .from('user_images')
        .update({ [field]: !currentValue })
        .eq('id', imageId)

      if (error) throw error

      queryClient.invalidateQueries(['allImages'])
      toast.success(`Image ${field} status updated`)
    } catch (error) {
      console.error('Error updating image:', error)
      toast.error('Failed to update image status')
    }
  }

  const handleDelete = async (imageId) => {
    try {
      await deleteImageCompletely(imageId)
      queryClient.invalidateQueries(['allImages'])
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {images?.map((image) => (
        <div key={image.id} className="flex items-center gap-4 p-4 bg-card rounded-lg">
          <img
            src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
            alt={image.prompt}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{image.prompt}</p>
            <div className="flex gap-8 mt-2">
              <label className="flex items-center gap-2">
                <span className="text-sm">Hot</span>
                <Switch
                  checked={image.is_hot}
                  onCheckedChange={() => handleToggle(image.id, 'is_hot', image.is_hot)}
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="text-sm">Trending</span>
                <Switch
                  checked={image.is_trending}
                  onCheckedChange={() => handleToggle(image.id, 'is_trending', image.is_trending)}
                />
              </label>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(image.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default ImageEditList