import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/integrations/supabase/supabase'
import { styleConfigs } from '@/utils/styleConfigs'

const MobileImageDrawer = ({ 
  open, 
  onOpenChange, 
  image, 
  showImage = false,
  onDownload,
  onDiscard,
  onRemix,
  isOwner = false
}) => {
  if (!image) return null

  const detailItems = [
    { label: "Model", value: image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] px-0">
        <SheetHeader className="px-6">
          <SheetTitle>Image Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full px-6">
          {showImage && (
            <div className="mb-6 -mx-6">
              <div className="relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                <img
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onRemix(image)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Remix
            </Button>
            {isOwner && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onDiscard(image)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Discard
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Prompt</h3>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                {image.prompt}
              </p>
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
      </SheetContent>
    </Sheet>
  )
}

export default MobileImageDrawer