const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function getNextApiKey() {
  const { data: key } = await supabase
    .rpc('get_next_api_key');
  return key;
}

async function uploadToStorage(imageBlob, userId, timestamp) {
  const filePath = `${userId}/${timestamp}.png`;
  const { data, error } = await supabase.storage
    .from('user-images')
    .upload(filePath, imageBlob);

  if (error) throw error;
  return filePath;
}

async function processGeneration(item) {
  try {
    console.log(`Processing generation ${item.id}`);
    
    // Update status to processing
    await supabase
      .from('generation_queue')
      .update({
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', item.id);

    // Get API key
    const apiKey = process.env.HUGGINGFACE_API_KEY || await getNextApiKey();
    if (!apiKey) throw new Error('No API key available');

    console.log(`Calling HuggingFace API for ${item.model}`);

    // Call HuggingFace API
    const response = await fetch(item.model, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: item.prompt,
        parameters: {
          ...item.parameters,
          width: item.width || 1024,
          height: item.height || 1024,
          num_inference_steps: item.parameters?.num_inference_steps || 30,
          guidance_scale: item.parameters?.guidance_scale || 7.5,
          seed: item.seed || Math.floor(Math.random() * 1000000)
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    console.log('Got response from HuggingFace, processing image');

    // Get image blob
    const imageBlob = await response.blob();
    
    // Upload to storage
    const timestamp = Date.now();
    const filePath = await uploadToStorage(imageBlob, item.user_id, timestamp);

    console.log(`Uploaded image to ${filePath}`);

    // Create image record
    const { data: image, error: imageError } = await supabase
      .from('user_images')
      .insert({
        user_id: item.user_id,
        storage_path: filePath,
        prompt: item.prompt,
        model: item.model,
        seed: item.seed || Math.floor(Math.random() * 1000000),
        width: item.width || 1024,
        height: item.height || 1024,
        quality: item.quality || 'standard',
        aspect_ratio: item.aspect_ratio || '1:1',
        is_private: !item.is_public,
        generation_id: item.id,
        metadata: {
          ...item.parameters,
          inference_steps: item.parameters?.num_inference_steps || 30,
          guidance_scale: item.parameters?.guidance_scale || 7.5
        }
      })
      .select()
      .single();

    if (imageError) throw imageError;

    console.log('Created image record');

    // Update queue item
    await supabase
      .from('generation_queue')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_url: filePath
      })
      .eq('id', item.id);

    console.log(`Completed generation ${item.id}`);

  } catch (error) {
    console.error('Error processing generation:', error);
    
    const shouldRetry = error.message.includes('429') || // Rate limit
                       error.message.includes('503') ||  // Service unavailable
                       error.message.includes('timeout') ||
                       error.message.includes('network');
    
    // Update queue item with error
    await supabase
      .from('generation_queue')
      .update({
        status: (shouldRetry && (item.retry_count || 0) < 3) ? 'pending' : 'failed',
        error: error.message,
        last_error: error.message,
        last_retry_at: new Date().toISOString(),
        retry_count: (item.retry_count || 0) + 1
      })
      .eq('id', item.id);
  }
}

async function processQueue() {
  console.log('Starting queue processing');
  
  // Get next pending item
  const { data: items, error } = await supabase
    .from('generation_queue')
    .select()
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching queue:', error);
    return;
  }

  if (!items?.length) {
    console.log('No pending items in queue');
    return;
  }

  console.log(`Found ${items.length} items to process`);

  // Process the item
  await processGeneration(items[0]);
}

// Run queue processor
processQueue()
  .catch(console.error)
  .finally(() => {
    console.log('Queue processing completed');
    process.exit(0);
  });