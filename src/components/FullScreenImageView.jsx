import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
          <div className="w-[350px] border-l bg-card">
            <ScrollArea className="h-[100vh]">
              <div className="p-6 space-y-8">
                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleAction(handleDownload)}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Image
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {isOwner && (
                      <Button 
                        onClick={() => handleAction(() => onDiscard(image.id))}
                        variant="destructive"
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => handleAction(() => onRemix(image))}
                      variant="secondary"
                      className={isOwner ? "" : "col-span-2"}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Remix
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Prompt Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Prompt</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyPrompt}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div 
                    className={`text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg cursor-pointer transition-all ${!isPromptExpanded && 'line-clamp-3'}`}
                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                  >
                    {image.prompt}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                    className="w-full text-xs hover:bg-muted/50"
                  >
                    {isPromptExpanded ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {isPromptExpanded ? 'Show less' : 'Show more'}
                  </Button>
                </div>

                <Separator />

                {/* Image Details */}
                <div className="space-y-4">
                  <h4 className="font-medium">Image Details</h4>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-sm text-muted-foreground">Model</span>
                      <Badge variant="secondary" className="justify-self-end">
                        {image.model}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-sm text-muted-foreground">Quality</span>
                      <Badge variant="secondary" className="justify-self-end">
                        {image.quality}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <Badge variant="secondary" className="justify-self-end">
                        {image.width}x{image.height}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-sm text-muted-foreground">Seed</span>
                      <Badge variant="secondary" className="justify-self-end">
                        {image.seed}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-sm text-muted-foreground">Style</span>
                      <Badge variant="secondary" className="justify-self-end">
                        {image.style || "General"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-sm text-muted-foreground">Aspect Ratio</span>
                      <Badge variant="secondary" className="justify-self-end">
                        {image.aspect_ratio}
                      </Badge>
                    </div>
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