import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { generating_images, timestamp, user_id } = await req.json()
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Insert the incomplete generation record
    const { error } = await supabaseClient
      .from('incomplete_generations')
      .insert({
        user_id,
        generating_images,
        timestamp
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Incomplete generation tracked successfully' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})