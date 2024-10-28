import React from 'react'
import { Drawer } from 'vaul'
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

  const handleAction = (action) => {
    onOpenChange(false)
    setTimeout(() => action(), 300)
  }

  return (
    <Drawer.Root 
      open={open} 
      onOpenChange={onOpenChange}
      dismissible
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 max-h-[95vh] rounded-t-[10px] border-t shadow-lg transition-transform duration-300 ease-in-out">
          <ScrollArea className="h-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
              
              {showImage && (
                <div className="mb-6 -mx-6">
                  <div className="relative rounded-lg overflow-hidden" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                    <img
                      src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                      alt={image.prompt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAction(() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt))}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAction(() => onRemix(image))}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Remix
                </Button>
                {isOwner && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAction(() => onDiscard(image))}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Discard
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Prompt</h3>
                  <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                    {image.prompt}
                  </p>
                </div>
                <Separator className="bg-border/50" />
                <div className="grid grid-cols-2 gap-4">
                  {detailItems.map((item, index) => (
                    <div key={index} className="space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <Badge variant="secondary" className="text-sm font-normal">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobileImageDrawer