import { HfInference } from "@huggingface/inference";
import { supabase } from '@/integrations/supabase/supabase';

export const improvePrompt = async (prompt) => {
  try {
    const { data: apiKey, error: apiKeyError } = await supabase.rpc('get_random_huggingface_api_key');
    if (apiKeyError) throw new Error(`Failed to get API key: ${apiKeyError.message}`);
    if (!apiKey) throw new Error('No active API key available');

    const client = new HfInference(apiKey);
    let improvedPrompt = "";

    const stream = await client.chatCompletionStream({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { 
          role: "system", 
          content: "You are an expert prompt maker for image generation, you will be given a prompt for image generation and you have to provide a better bigger and more detailed version of it." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        improvedPrompt += newContent;
      }
    }

    return improvedPrompt.trim();
  } catch (error) {
    console.error('Error improving prompt:', error);
    throw error;
  }
};