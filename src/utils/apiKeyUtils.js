import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const getApiKey = async () => {
  try {
    // First attempt: Get any active key
    let { data: activeKeys, error: activeKeysError } = await supabase
      .from('huggingface_api_keys')
      .select('api_key')
      .eq('is_active', true)
      .limit(1);

    if (activeKeysError) {
      console.error('Error fetching active keys:', activeKeysError);
      throw activeKeysError;
    }

    // If we have active keys, use the first one
    if (activeKeys?.length > 0) {
      const key = activeKeys[0].api_key;
      await updateKeyLastUsed(key);
      return key;
    }

    // Second attempt: Get any key and activate it
    const { data: anyKey, error: anyKeyError } = await supabase
      .from('huggingface_api_keys')
      .select('api_key')
      .limit(1);

    if (anyKeyError) {
      console.error('Error fetching any key:', anyKeyError);
      throw anyKeyError;
    }

    if (!anyKey?.length) {
      toast.error('No API keys available');
      throw new Error('No API keys available');
    }

    // Activate the key
    const key = anyKey[0].api_key;
    const { error: updateError } = await supabase
      .from('huggingface_api_keys')
      .update({ 
        is_active: true,
        last_used_at: new Date().toISOString()
      })
      .eq('api_key', key);

    if (updateError) {
      console.error('Error activating key:', updateError);
      throw updateError;
    }

    return key;
  } catch (error) {
    console.error('Error getting API key:', error);
    toast.error('Failed to get API key');
    throw error;
  }
};

const updateKeyLastUsed = async (apiKey) => {
  try {
    const { error } = await supabase
      .from('huggingface_api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('api_key', apiKey);

    if (error) {
      console.error('Error updating key last used:', error);
    }
  } catch (error) {
    console.error('Error updating key last used:', error);
  }
};