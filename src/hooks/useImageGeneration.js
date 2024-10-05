import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'
import { modelConfigs } from '@/utils/modelConfigs'
import { aspectRatios } from '@/utils/imageConfigs'

// Helper function to ensure dimensions are divisible by 8
const makeDivisibleBy8 = (num) => Math.floor(num / 8) * 8;

const MAX_RETRIES = 10;
const RETRY_INTERVAL = 120000; // 2 minutes in milliseconds

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

  const generateImage = async (retryCount = 0) => {
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

    // Ensure dimensions are divisible by 8
    finalWidth = makeDivisibleBy8(finalWidth);
    finalHeight = makeDivisibleBy8(finalHeight);

    if (retryCount === 0) {
      setGeneratingImages(prev => [...prev, { width: finalWidth, height: finalHeight }])
    }

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
      // Get a random API key from the database
      const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('get_random_huggingface_api_key')
      
      if (apiKeyError) {
        throw new Error(`Failed to get API key: ${apiKeyError.message}`)
      }

      if (!apiKeyData) {
        throw new Error('No active API key available')
      }

      console.log('Sending request to:', modelConfigs[model]?.apiUrl);
      console.log('Request data:', JSON.stringify(data, null, 2));

      const response = await fetch(
        modelConfigs[model]?.apiUrl,
        {
          headers: {
            Authorization: `Bearer ${apiKeyData}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API response error:', errorData);

        if (response.status === 503 && errorData.error && errorData.error.includes("is currently loading")) {
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying image generation in 2 minutes. Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
            setTimeout(() => generateImage(retryCount + 1), RETRY_INTERVAL);
            return;
          } else {
            throw new Error('Max retries reached. The model is still loading.');
          }
        }

        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const imageBlob = await response.blob()

      if (!imageBlob || imageBlob.size === 0) {
        console.error('Generated image is empty or invalid');
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
      if (retryCount === 0) {
        toast.error(`Failed to generate image: ${error.message}`)
      }
      setGeneratingImages(prev => prev.slice(1))
    }
  }

  return { generateImage }
}