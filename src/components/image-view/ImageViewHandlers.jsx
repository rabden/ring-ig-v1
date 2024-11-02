import { supabase } from '@/integrations/supabase/supabase';

export const useImageViewHandlers = (image, session, navigate) => {
  const handleDownload = async () => {
    if (!session) {
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
      return;
    }
    navigate('/', { state: { remixImage: image } });
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.prompt);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  return {
    handleDownload,
    handleRemix,
    handleCopyPrompt,
    handleShare
  };
};