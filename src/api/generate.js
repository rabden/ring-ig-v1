import { supabase } from '@/integrations/supabase/supabase';

export async function generateImage(req) {
  try {
    // Extract the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract request body
    const body = await req.json();
    const { 
      prompt, 
      seed, 
      width, 
      height, 
      model, 
      quality, 
      style, 
      steps, 
      generationIds 
    } = body;

    // Make request to Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt,
        seed,
        width,
        height,
        model,
        quality,
        style,
        steps,
        generationIds
      }
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ message: 'Image generation started' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate endpoint:', error);
    return new Response(JSON.stringify({ 
      message: error.message || 'Failed to generate image' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}