const MISTRAL_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

export const improvePrompt = async (prompt) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are an expert prompt maker for image generation, you will be given a prompt for image generation and you have to provide a better optimized and more refined version of it."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getRandomHuggingfaceApiKey()}`
      },
      body: JSON.stringify({
        inputs: messages,
        parameters: {
          max_new_tokens: 4096,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to improve prompt");
    }

    const data = await response.json();
    return data[0].generated_text.trim();
  } catch (error) {
    console.error("Error improving prompt:", error);
    throw error;
  }
};

// Helper function to get a random API key from our Supabase backend
const getRandomHuggingfaceApiKey = async () => {
  const { data, error } = await supabase.rpc('get_random_huggingface_api_key');
  if (error) throw error;
  return data;
};