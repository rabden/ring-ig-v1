import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw } from "lucide-react";

const ImageViewActions = ({ onDownload, onDiscard, onRemixClick, isOwner }) => (
  <div className="flex gap-2 justify-between">
    <Button onClick={onDownload} className="flex-1" variant="ghost" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
    {isOwner && (
      <Button onClick={onDiscard} className="flex-1 text-destructive hover:text-destructive" variant="ghost" size="sm">
        <Trash2 className="mr-2 h-4 w-4" />
        Discard
      </Button>
    )}
    <Button onClick={onRemixClick} className="flex-1" variant="ghost" size="sm">
      <RefreshCw className="mr-2 h-4 w-4" />
      Remix
    </Button>
  </div>
);

export default ImageViewActions;