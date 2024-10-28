import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  onRemix,
  isOwner 
}) => {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  
  if (!isOpen || !image) {
    return null;
  }

  const handleAction = (action) => {
    action();
    onClose();
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleDownload = () => {
    onDownload(
      supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl,
      image.prompt
    );
  };

  // Get first few words of prompt for title
  const promptTitle = image.prompt.split(' ').slice(0, 4).join(' ') + '...';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background">
        <div className="flex h-full">
          {/* Left side - Image */}
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="max-w-full max-h-[100vh] object-contain"
            />
          </div>

          {/* Right side - Details and Actions */}
          <div className="w-[350px] border-l">
            <ScrollArea className="h-[100vh]">
              <div className="p-6 space-y-6">
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleAction(handleDownload)}
                    className="col-span-2"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  {isOwner && (
                    <Button 
                      onClick={() => handleAction(() => onDiscard(image.id))}
                      variant="destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Discard
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => handleAction(() => onRemix(image))}
                    variant="outline"
                    className={isOwner ? "" : "col-span-2"}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                </div>

                {/* Prompt Title and Copy Button */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold truncate mr-2">{promptTitle}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyPrompt}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Expandable Prompt */}
                <div className="space-y-2">
                  <div 
                    className={`text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg cursor-pointer ${!isPromptExpanded && 'line-clamp-3'}`}
                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                  >
                    {image.prompt}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                    className="w-full text-xs"
                  >
                    {isPromptExpanded ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {isPromptExpanded ? 'Show less' : 'Show more'}
                  </Button>
                </div>

                {/* Image Details */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Image Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Model:</div>
                    <div className="text-muted-foreground">{image.model}</div>
                    <div>Quality:</div>
                    <div className="text-muted-foreground">{image.quality}</div>
                    <div>Size:</div>
                    <div className="text-muted-foreground">{image.width}x{image.height}</div>
                    <div>Seed:</div>
                    <div className="text-muted-foreground">{image.seed}</div>
                    <div>Style:</div>
                    <div className="text-muted-foreground">{image.style || "General"}</div>
                    <div>Aspect Ratio:</div>
                    <div className="text-muted-foreground">{image.aspect_ratio}</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;