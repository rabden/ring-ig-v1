import React from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const FullScreenImageView = ({
  image,
  isOpen,
  onClose,
  onDownload,
  onDiscard,
  onRemix,
  isOwner,
  setStyle,
  setActiveTab
}) => {
  const handleRemix = () => {
    onRemix(image);
    setActiveTab('input');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-full">
        <Dialog.Overlay className="fixed inset-0 bg-black/75" />
        <div className="relative bg-white rounded-lg max-w-lg mx-auto p-4">
          <Button className="absolute top-2 right-2" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <img
            src={image?.url}
            alt={image?.prompt}
            className="w-full h-auto rounded"
            loading="lazy"
          />
          <div className="mt-2 flex justify-between">
            <Button onClick={onDownload} variant="outline">
              Download
            </Button>
            {isOwner && (
              <Button onClick={handleRemix} variant="outline">
                Remix
              </Button>
            )}
            {isOwner && (
              <Button onClick={() => onDiscard(image)} variant="outline" className="text-red-500">
                Discard
              </Button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FullScreenImageView;
