import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';

const PublicDesktopView = ({ 
  image, 
  modelConfigs, 
  styleConfigs, 
  onDownload, 
  onRemix,
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Button variant="ghost" className="mb-4" onClick={onBack}>
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Image Details</h3>
                <p className="text-sm text-muted-foreground">{image.prompt}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Settings</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Model:</div>
                  <div className="text-muted-foreground">{modelConfigs?.[image.model]?.name || image.model}</div>
                  <div>Quality:</div>
                  <div className="text-muted-foreground">{image.quality}</div>
                  <div>Size:</div>
                  <div className="text-muted-foreground">{image.width}x{image.height}</div>
                  <div>Style:</div>
                  <div className="text-muted-foreground">{styleConfigs?.[image.style]?.name || "General"}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={onDownload} className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={onRemix} className="w-full" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default PublicDesktopView;