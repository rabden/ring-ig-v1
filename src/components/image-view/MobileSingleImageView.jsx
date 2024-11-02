import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/supabase';
import ImageDetails from './ImageDetails';
import ImageSettings from './ImageSettings';
import ImageActions from './ImageActions';

const MobileSingleImageView = ({ 
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
    <div className="min-h-screen bg-background">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 z-10" 
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="relative">
        <img
          src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
          alt={image.prompt}
          className="w-full h-auto"
        />
      </div>

      <div className="px-4">
        <ScrollArea className="h-[calc(100vh-50vh)] mt-4">
          <div className="space-y-6 pb-8">
            {session && (
              <ImageActions 
                handleDownload={handleDownload}
                handleRemix={handleRemix}
              />
            )}
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
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MobileSingleImageView;