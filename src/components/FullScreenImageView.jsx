import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';

const FullScreenImageView = ({ image, isOpen, onClose }) => {
  if (!isOpen || !image) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full p-0 bg-background/80 backdrop-blur-sm">
        <div className="relative w-full h-screen flex items-center justify-center">
          <img
            src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
            alt={image.prompt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;