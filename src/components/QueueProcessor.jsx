import React, { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'
import { modelConfigs } from '@/utils/modelConfigs'

const QueueProcessor = () => {
  const queryClient = useQueryClient()

  const { data: queueItems, isLoading, error } = useQuery({
    queryKey: ['imageGenerationQueue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('image_generation_queue')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
      if (error) throw error
      return data
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  })

  const processQueueItemMutation = useMutation({
    mutationFn: async (item) => {
      // Update status to 'processing'
      await supabase
        .from('image_generation_queue')
        .update({ status: 'processing' })
        .eq('id', item.id)

      // Generate image
      const response = await fetch(
        modelConfigs[item.model].apiUrl,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: item.prompt,
            parameters: {
              seed: item.seed,
              width: item.width,
              height: item.height,
              num_inference_steps: item.steps
            }
          }),
        }
      )
      const imageBlob = await response.blob()

      // Upload image to storage
      const filePath = `${item.user_id}/${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageBlob)
      if (uploadError) throw uploadError

      // Add image to user_images table
      const { error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: item.user_id,
          storage_path: filePath,
          prompt: item.prompt,
          model: item.model,
          seed: item.seed,
          width: item.width,
          height: item.height,
          steps: item.steps,
          quality: item.quality,
          aspect_ratio: item.aspect_ratio,
        })
      if (insertError) throw insertError

      // Update queue item status to 'completed'
      await supabase
        .from('image_generation_queue')
        .update({ status: 'completed' })
        .eq('id', item.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['imageGenerationQueue'])
      queryClient.invalidateQueries(['userImages'])
      toast.success('Image generated successfully')
    },
    onError: (error) => {
      console.error('Error processing queue item:', error)
      toast.error('Failed to process queue item')
    },
  })

  useEffect(() => {
    if (queueItems && queueItems.length > 0) {
      processQueueItemMutation.mutate(queueItems[0])
    }
  }, [queueItems])

  return null // This component doesn't render anything
}

export default QueueProcessor