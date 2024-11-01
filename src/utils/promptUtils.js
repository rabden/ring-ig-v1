import { HfInference } from "@huggingface/inference";
import { supabase } from '@/integrations/supabase/supabase';

export const improvePrompt = async (prompt) => {
  try {
    const { data: apiKey, error: apiKeyError } = await supabase.rpc('get_random_huggingface_api_key');
    if (apiKeyError) throw new Error(`Failed to get API key: ${apiKeyError.message}`);
    if (!apiKey) throw new Error('No active API key available');

    const client = new HfInference(apiKey);
    
    const response = await client.textGeneration({
      model: "tiiuae/falcon-7b-instruct",
      inputs: `You are an expert prompt maker for image generation. Make this prompt better, bigger and more detailed: "${prompt}"`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error('Error improving prompt:', error);
    throw error;
  }
};