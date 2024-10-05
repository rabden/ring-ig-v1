import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'
import { modelConfigs } from '@/utils/modelConfigs'
import { aspectRatios } from '@/utils/imageConfigs'

const API_KEY = "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";

export const useImageGeneration = ({
  session,
  prompt,
  seed,
  randomizeSeed,
  width,
  height,
  steps,
  model,
  quality,
  useAspectRatio,
  aspectRatio,
  updateCredits,
  setGeneratingImages,
}) => {
  const uploadImageMutation = useMutation({
    mutationFn: async ({ imageBlob, metadata }) => {
      const filePath = `${session.user.id}/${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageBlob)
      if (uploadError) throw uploadError

      const { data: publicURL } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: session.user.id,
          storage_path: filePath,
          ...metadata,
        })
      if (insertError) throw insertError
    },
    onSuccess: () => {
      setGeneratingImages(prev => prev.slice(1))
    },
    onError: (error) => {
      console.error('Error uploading image:', error)
      toast.error('Failed to save image. Please try again.')
      setGeneratingImages(prev => prev.slice(1))
    },
  })

  const generateImage = async () => {
    if (!session) {
      console.log('User not authenticated')
      return
    }

    if (!prompt) {
      toast.error('Please enter a prompt')
      return
    }

    const creditCost = {
      "SD": 1,
      "HD": 2,
      "HD+": 3,
      "4K": 4
    }[quality]

    if (session.credits < creditCost) {
      toast.error(`Insufficient credits. You need ${creditCost} credits for ${quality} quality.`)
      return
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed

    let modifiedPrompt = prompt;

    if (modelConfigs[model]?.promptSuffix) {
      modifiedPrompt += modelConfigs[model].promptSuffix;
    }

    // Calculate dimensions based on aspect ratio if useAspectRatio is true
    let finalWidth = width;
    let finalHeight = height;
    if (useAspectRatio && aspectRatios[aspectRatio]) {
      const { width: ratioWidth, height: ratioHeight } = aspectRatios[aspectRatio];
      const maxDimension = Math.max(width, height);
      finalWidth = Math.round((ratioWidth / Math.max(ratioWidth, ratioHeight)) * maxDimension);
      finalHeight = Math.round((ratioHeight / Math.max(ratioWidth, ratioHeight)) * maxDimension);
    }

    setGeneratingImages(prev => [...prev, { width: finalWidth, height: finalHeight }])

    const data = {
      inputs: modifiedPrompt,
      parameters: {
        seed: actualSeed,
        width: finalWidth,
        height: finalHeight,
        num_inference_steps: steps
      }
    }

    try {
      const response = await fetch(
        modelConfigs[model]?.apiUrl,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || 'Unknown error'}`);
      }

      const imageBlob = await response.blob()

      if (!imageBlob || imageBlob.size === 0) {
        throw new Error('Generated image is empty or invalid');
      }

      await updateCredits(quality)

      await uploadImageMutation.mutateAsync({ 
        imageBlob, 
        metadata: {
          prompt: modifiedPrompt,
          seed: actualSeed,
          width: finalWidth,
          height: finalHeight,
          steps,
          model,
          quality,
          aspect_ratio: useAspectRatio ? aspectRatio : `${finalWidth}:${finalHeight}`,
        }
      })

      toast.success(`Image generated successfully. ${creditCost} credits used.`)
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error(`Failed to generate image: ${error.message}`)
      setGeneratingImages(prev => prev.slice(1))
    }
  }

  return { generateImage }
}