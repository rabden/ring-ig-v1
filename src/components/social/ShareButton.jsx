import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const ShareButton = ({ imageUrl, prompt }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this AI-generated image!',
          text: prompt,
          url: imageUrl
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share image');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};

export default ShareButton;