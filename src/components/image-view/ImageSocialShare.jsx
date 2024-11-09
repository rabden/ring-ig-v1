import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Link, Twitter, Facebook } from "lucide-react";
import { toast } from 'sonner';

const ImageSocialShare = ({ imageId, imageUrl }) => {
  const shareUrl = `${window.location.origin}/image/${imageId}`;
  
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };

  const handleShare = (platform) => {
    const shareText = "Check out this AI-generated image!";
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(shareText)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        <Link className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
        <Twitter className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
        <Facebook className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default ImageSocialShare;