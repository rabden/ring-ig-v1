import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Download, Trash2, Info, Repeat } from "lucide-react";
import { cn } from '@/lib/utils';

const ActionButton = ({ icon: Icon, onClick, isActive, label, disabled }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-8 w-8",
      "bg-transparent hover:bg-white/10",
      "opacity-70 hover:opacity-100",
      "transition-all duration-200",
      isActive && "text-red-500 opacity-100"
    )}
    title={label}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

const ImageCardActions = ({
  image,
  isMobile,
  isLiked,
  likeCount,
  onToggleLike,
  onViewDetails,
  onDownload,
  onDiscard,
  onRemix,
  userId
}) => {
  const isOwner = image.user_id === userId;
  const canRemix = !image.is_private;

  return (
    <div className={cn(
      "flex items-center gap-0.5",
      "opacity-80 group-hover:opacity-100",
      "transition-all duration-200"
    )}>
      <div className="flex items-center">
        <ActionButton
          icon={Heart}
          onClick={() => onToggleLike(image.id)}
          isActive={isLiked}
          label={`Like (${likeCount})`}
        />
        {likeCount > 0 && (
          <span className={cn(
            "text-xs ml-1 mr-2",
            "text-white/70 group-hover:text-white",
            "transition-colors duration-200"
          )}>
            {likeCount}
          </span>
        )}
      </div>

      <ActionButton
        icon={Download}
        onClick={onDownload}
        label="Download"
      />

      {canRemix && (
        <ActionButton
          icon={Repeat}
          onClick={() => onRemix(image)}
          label="Remix"
        />
      )}

      <ActionButton
        icon={Info}
        onClick={onViewDetails}
        label="Details"
      />

      {isOwner && (
        <ActionButton
          icon={Trash2}
          onClick={() => onDiscard(image.id)}
          label="Delete"
        />
      )}
    </div>
  );
};

export default ImageCardActions;