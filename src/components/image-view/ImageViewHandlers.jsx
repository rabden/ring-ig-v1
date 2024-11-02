import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';

export const useImageViewHandlers = (image, session, navigate) => {
  const handleDownload = async () => {
    if (!session) {
      toast.error('Please sign in to download images');
      return;
    }
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${image.prompt.slice(0, 30)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemix = () => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }
    navigate('/', { state: { remixImage: image } });
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      toast.success('Prompt copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Share link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy share link');
    }
  };

  return {
    handleDownload,
    handleRemix,
    handleCopyPrompt,
    handleShare
  };
};