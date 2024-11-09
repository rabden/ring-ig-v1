import { useState } from 'react';
import { improvePrompt } from '@/utils/promptImprovement';
import { toast } from 'sonner';

export const usePromptImprovement = () => {
  const [isImproving, setIsImproving] = useState(false);

  const improveCurrentPrompt = async (prompt, onSuccess) => {
    if (!prompt?.trim()) {
      toast.error('Please enter a prompt', {
        position: 'top-center'
      });
      return;
    }

    setIsImproving(true);
    const toastId = toast.loading('Improving prompt...', {
      position: 'top-center'
    });
    
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const result = await Promise.race([
        improvePrompt(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 30000)
        )
      ]);

      clearTimeout(timeoutId);

      if (result) {
        onSuccess(result);
        toast.success('Prompt improved!', { 
          id: toastId,
          position: 'top-center'
        });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      let errorMessage = 'Failed to improve prompt';
      
      if (error.name === 'AbortError' || error.message === 'Request timed out') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }
      
      toast.error(errorMessage, { 
        id: toastId,
        position: 'top-center'
      });
    } finally {
      setIsImproving(false);
    }
  };

  return {
    isImproving,
    improveCurrentPrompt
  };
};