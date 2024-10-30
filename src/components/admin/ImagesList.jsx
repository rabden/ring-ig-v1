import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

const ImagesList = () => {
  const queryClient = useQueryClient()

  const { data: images, isLoading } = useQuery({
    queryKey: ['admin-images'],
    queryFn: async () => {
      const { data: images, error } = await supabase
        .from('user_images')
        .select(`
          *,
          user:auth.users (
            email
          )
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return images
    }
  })

  const updateImageMutation = useMutation({
    mutationFn: async ({ imageId, updates }) => {
      const { error } = await supabase
        .from('user_images')
        .update(updates)
        .eq('id', imageId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-images'])
      toast.success('Image updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update image: ' + error.message)
    }
  })

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId) => {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', imageId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-images'])
      toast.success('Image deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete image: ' + error.message)
    }
  })

  if (isLoading) {
    return <div>Loading images...</div>
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Hot</TableHead>
            <TableHead>Trending</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images?.map((image) => (
            <TableRow key={image.id}>
              <TableCell>
                <img 
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt}
                  className="w-20 h-20 object-cover rounded"
                />
              </TableCell>
              <TableCell>{image.user?.email}</TableCell>
              <TableCell className="max-w-xs truncate">{image.prompt}</TableCell>
              <TableCell>{image.model}</TableCell>
              <TableCell>
                <Switch 
                  checked={image.is_hot}
                  onCheckedChange={(checked) => 
                    updateImageMutation.mutate({ 
                      imageId: image.id, 
                      updates: { is_hot: checked }
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={image.is_trending}
                  onCheckedChange={(checked) => 
                    updateImageMutation.mutate({ 
                      imageId: image.id, 
                      updates: { is_trending: checked }
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this image?')) {
                      deleteImageMutation.mutate(image.id)
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

export default ImagesList