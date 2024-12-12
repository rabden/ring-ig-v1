import { HfInference } from "@huggingface/inference";
import { supabase } from '@/integrations/supabase/supabase';

export const improvePrompt = async (originalPrompt) => {
  try {
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('huggingface_api_keys')
      .select('api_key')
      .eq('is_active', true)
      .order('last_used_at', { ascending: true })
      .limit(1)
      .single();
    
    if (apiKeyError) {
      throw new Error(`Failed to get API key: ${apiKeyError.message}`);
    }
    if (!apiKeyData) {
      throw new Error('No active API key available');
    }

    // Update the last_used_at timestamp for the selected key
    await supabase
      .from('huggingface_api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('api_key', apiKeyData.api_key);

    const client = new HfInference(apiKeyData.api_key);
    
    const response = await client.chatCompletion({
      model: "01-ai/Yi-1.5-34B-Chat",
      messages: [
        {
          role: "system",
          content: `You are an expert at improving image generation prompts. Follow these rules:
1. Keep the core subject and concept from the original prompt
2. Add artistic details like lighting, camera angles, and atmosphere
3. Include relevant style descriptors (cinematic, photorealistic, etc.)
4. Add technical aspects like quality modifiers (4K, HDR, etc.)
5. Keep the prompt concise and clear
6. Do not add NSFW content
7. Return ONLY the improved prompt text, no explanations or comments`
        },
        {
          role: "user",
          content: originalPrompt
        }
      ],
      max_tokens: 2048,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error improving prompt:', error);
    throw error;
  }
};