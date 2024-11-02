import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/supabase';
import ImageDetails from './ImageDetails';
import ImageSettings from './ImageSettings';
import ImageActions from './ImageActions';

const DesktopSingleImageView = ({ 
  image, 
  session, 
  modelConfigs, 
  styleConfigs, 
  copyPromptIcon,
  copyShareIcon,
  handleBack,
  handleCopyPromptWithIcon,
  handleShareWithIcon,
  handleDownload,
  handleRemix
}) => {
  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" className="mb-4" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="relative bg-black/10 dark:bg-black/30 rounded-lg overflow-hidden">
          <img
            src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
            alt={image.prompt}
            className="w-full h-auto object-contain"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 p-4">
            <ImageDetails 
              image={image}
              copyPromptIcon={copyPromptIcon}
              copyShareIcon={copyShareIcon}
              handleCopyPromptWithIcon={handleCopyPromptWithIcon}
              handleShareWithIcon={handleShareWithIcon}
            />
            <ImageSettings 
              modelConfigs={modelConfigs}
              styleConfigs={styleConfigs}
              image={image}
            />
            {session && (
              <ImageActions 
                handleDownload={handleDownload}
                handleRemix={handleRemix}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DesktopSingleImageView;