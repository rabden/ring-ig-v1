import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export const improvePrompt = async (originalPrompt) => {
  try {
    let improvedPrompt = "";
    
    const stream = await client.chatCompletionStream({
      model: "01-ai/Yi-1.5-34B-Chat",
      messages: [
        {
          role: "system",
          content: "You are an AI that enhances logo generation prompts. Add details like colors, style, typography, and brand identity. Make prompts industry-specific, visually clear, and unique. Example: Basic prompt: \"Create a logo for a bakery.\" Improved prompt: \"Design a vintage-style bakery logo with pastel colors (light pink, cream). Include a whisk and rolling pin icon. Use cursive font for the name to evoke warmth and tradition.\""
        },
        {
          role: "user",
          content: originalPrompt
        }
      ],
      max_tokens: 2048
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