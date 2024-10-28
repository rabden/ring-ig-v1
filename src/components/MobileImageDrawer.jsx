import React from 'react'
import { Drawer } from 'vaul'
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  const [snapPoint, setSnapPoint] = React.useState(1)
  
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
    <Drawer.Root 
      open={open} 
      onOpenChange={onOpenChange}
      snapPoints={[0.1, 1]}
      activeSnapPoint={snapPoint}
      setActiveSnapPoint={setSnapPoint}
      dismissible
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 max-h-[95vh] overflow-hidden">
          <div className="p-4 bg-muted/40 rounded-t-[10px] h-full overflow-y-auto scrollbar-hide">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-8" />
            <div className="h-full">
              {showImage && (
                <div className="mb-6 -mx-4">
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
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobileImageDrawer