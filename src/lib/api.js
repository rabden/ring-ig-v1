import { supabase } from '@/integrations/supabase/supabase';
import { qualityOptions } from '@/utils/imageConfigs';
import { calculateDimensions, getModifiedPrompt } from '@/utils/imageUtils';

export const generateImage = async ({ prompt, model, style, quality, width, height, seed }) => {
  try {
    const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('get_random_huggingface_api_key');
    if (apiKeyError) {
      throw new Error(`Failed to get API key: ${apiKeyError.message}`);
    }
    if (!apiKeyData) {
      throw new Error('No active API key available');
    }

    const modelConfig = {
      sdxl: {
        apiUrl: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        defaultStep: 30
      },
      turbo: {
        apiUrl: 'https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo',
        defaultStep: 1
      }
    }[model];

    if (!modelConfig) {
      throw new Error('Invalid model selected');
    }

    // Base parameters that all models support
    const parameters = {
      seed: seed || Math.floor(Math.random() * 1000000),
      width,
      height,
      num_inference_steps: modelConfig.defaultStep,
    };

    // Add negative_prompt only for non-FLUX models
    if (!model.toLowerCase().includes('flux')) {
      parameters.negative_prompt = "ugly, disfigured, low quality, blurry, nsfw";
    }

    const response = await fetch(modelConfig.apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKeyData}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error('Generated image is empty or invalid');
    }

    return { blob };

  } catch (error) {
    return { error: error.message };
  }
};