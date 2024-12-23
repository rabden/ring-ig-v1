import React, { useState, useEffect } from 'react'
import { Loader, Check, Clock, XCircle, Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useModelConfigs } from '@/hooks/useModelConfigs'
import { cn } from "@/lib/utils"
import { toast } from 'sonner'

const GeneratingImagesDropdown = ({ generatingImages = [], onCancel }) => {
  const { data: modelConfigs } = useModelConfigs();
  const [showDropdown, setShowDropdown] = useState(false);

  // Show dropdown whenever there are any images (generating or completed)
  useEffect(() => {
    if (generatingImages.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [generatingImages.length]);

  const handleCopy = (prompt) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  };

  if (!showDropdown) return null;

  const processingCount = generatingImages.filter(img => img.status === 'processing').length;
  const pendingCount = generatingImages.filter(img => img.status === 'pending').length;
  const completedCount = generatingImages.filter(img => img.status === 'completed').length;
  const failedCount = generatingImages.filter(img => img.status === 'failed').length;
  const isAllCompleted = generatingImages.length > 0 && generatingImages.every(img => img.status === 'completed');
  const hasRetrying = generatingImages.some(img => img.status === 'processing' && img.retryCount > 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-8 rounded-xl bg-background/50 hover:bg-accent",
            "transition-all duration-200",
            isAllCompleted && "text-primary",
            failedCount > 0 && "text-red-500"
          )}
        >
          {isAllCompleted ? (
            <div className={cn(
              "p-1 rounded-lg mr-2",
              "animate-in zoom-in duration-300"
            )}>
              <Check className="w-4 h-4 text-primary/90" />
            </div>
          ) : failedCount > 0 ? (
            <div className="p-1 rounded-lg mr-2">
              <XCircle className="w-4 h-4 text-red-500/90" />
            </div>
          ) : (
            <div className="p-1 rounded-lg mr-2">
              <Loader className="w-4 h-4 animate-spin text-primary/90" />
            </div>
          )}
          <span className="text-sm">
            {processingCount > 0 ? (
              hasRetrying ? 'Retrying...' : 'Generating'
            ) : 
             pendingCount > 0 ? `Queued-${pendingCount}` : 
             completedCount > 0 ? `Generated-${completedCount}` : 
             failedCount > 0 ? `Failed-${failedCount}` :
             'Complete'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[300px] p-2 border-border/80 bg-card"
      >
        {generatingImages.map((img) => (
          <DropdownMenuItem 
            key={img.id} 
            className={cn(
              "flex flex-col items-start gap-2 p-3 rounded-lg",
              "transition-all duration-200",
              "hover:bg-accent/10 focus:bg-accent/10",
              "group"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg ">
                  {img.status === 'processing' ? (
                    <Loader className="w-3.5 h-3.5 animate-spin text-primary/90" />
                  ) : img.status === 'pending' ? (
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                  ) : img.status === 'failed' ? (
                    <XCircle className="w-3.5 h-3.5 text-red-500/90" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-primary/90" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  img.status === 'completed' ? "text-primary/90" :
                  img.status === 'failed' ? "text-red-500/90" :
                  "text-muted-foreground/90"
                )}>
                  {img.status === 'processing' ? (
                    img.retryCount 
                      ? `Retrying (${img.retryCount}/5)` 
                      : 'Generating...'
                  ) : 
                   img.status === 'pending' ? 'Queued' :
                   img.status === 'failed' ? 'Failed' :
                   'Complete'}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                {img.prompt && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground/70 hover:text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(img.prompt);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
                {(img.status === 'processing' || img.status === 'pending') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500/70 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel?.(img.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "transition-colors duration-200",
                    img.status === 'completed' 
                      ? "bg-muted/20 hover:bg-muted/30 text-foreground/70"
                      : img.status === 'failed'
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-500/90"
                      : "bg-muted/10 hover:bg-muted/20 text-muted-foreground/70"
                  )}
                >
                  {img.width}x{img.height}
                </Badge>
              </div>
            </div>
            {img.prompt && (
              <span className="text-xs text-muted-foreground/60 truncate w-full group-hover:text-muted-foreground/70 transition-colors duration-200">
                {img.prompt.length > 50 ? `${img.prompt.substring(0, 50)}...` : img.prompt}
              </span>
            )}
            {img.error && (
              <span className="text-xs text-red-500/80 truncate w-full">
                {img.error}
              </span>
            )}
            {img.retryReason && img.status === 'processing' && (
              <span className="text-xs text-amber-500/80 truncate w-full">
                {img.retryReason}
              </span>
            )}
            <div className="flex gap-2 text-xs text-muted-foreground/50 group-hover:text-muted-foreground/60 transition-colors duration-200">
              <span>{modelConfigs?.[img.model]?.name || img.model}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneratingImagesDropdown;