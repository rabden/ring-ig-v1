import { HfInference } from "@huggingface/inference";
import { supabase } from '@/integrations/supabase/supabase';
import { modelConfig } from '@/config/modelConfig';

export const improvePrompt = async (originalPrompt, activeModel) => {
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
    
    const modelExample = modelConfig[activeModel]?.example || "a photo of a cat, high quality, detailed";
    
    const response = await client.chatCompletion({
      model: "01-ai/Yi-1.5-34B-Chat",
      messages: [
        {
          role: "system",
          content: `You are an expert at crafting high-quality image generation prompts. Your task is to enhance the given prompt while maintaining its core concept and artistic intent. Follow these guidelines:

1. Preserve the main subject and style of the original prompt
2. Add relevant quality-enhancing terms like "highly detailed", "professional", or "masterful" where appropriate
3. Include lighting, atmosphere, and composition details if missing
4. Reference this example prompt structure: ${modelExample}
5. Keep the prompt clear and well-structured
6. Do not add unrelated concepts or change the core idea
7. Maintain any specific artistic style mentioned in the original prompt

Respond only with the improved prompt, no explanations.`
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