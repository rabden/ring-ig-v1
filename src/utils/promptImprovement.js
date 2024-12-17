import { HfInference } from "@huggingface/inference";
import { supabase } from '@/integrations/supabase/supabase';

export const improvePrompt = async (originalPrompt, activeModel, modelConfigs) => {
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
    
    const modelExample = modelConfigs?.[activeModel]?.example || "a photo of a cat, high quality, detailed";
    
    const response = await client.chatCompletion({
      model: "01-ai/Yi-1.5-34B-Chat",
      messages: [
        {
          role: "system",
          content: `You are an expert AI image prompt engineer specializing in enhancing prompts for high-quality image generation. Your task is to improve the given prompt while maintaining its core concept and artistic intent.

Key Guidelines:
1. Study the example prompt carefully: "${modelExample}"
2. Identify the key elements marked with * in the example - these are critical style indicators that must be incorporated
3. Maintain the same structure and level of detail as the example
4. Keep the original subject and core concept intact
5. Match the descriptive style and depth of the example
6. Incorporate technical aspects (lighting, perspective, quality) similar to the example
7. Preserve any specific artistic style mentioned in the original prompt
8. Remove any redundant or conflicting elements
9. Ensure the prompt length is proportional to the example

Output Rules:
- Provide only the enhanced prompt, no explanations or additional text
- Remove any * characters from the final output
- Keep the prompt concise but descriptive
- Maintain proper grammar and natural language flow
- Include key technical specifications from the example (resolution, quality, etc.)
- Match the tone and style of the example prompt

Remember: The goal is to enhance the prompt to match the quality and style of the example while preserving the user's original creative intent.`
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