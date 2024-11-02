import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { toast } from 'sonner'
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import { useModelConfigs } from '@/hooks/useModelConfigs'

const ImageDetailsDialog = ({ open, onOpenChange, image }) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();
  
  if (!image) return null;

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs?.[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  const handleCopy = () => {
    toast.success('Prompt copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Image Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[calc(80vh-100px)]">
          <div className="space-y-6 p-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Prompt</h3>
                <CopyToClipboard text={image.prompt} onCopy={handleCopy}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </CopyToClipboard>
              </div>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{image.prompt}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              {detailItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <Badge variant="outline" className="text-sm font-normal">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;