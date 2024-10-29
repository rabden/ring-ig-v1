import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Trash2 } from "lucide-react";

const ImageActions = ({ onDownload, onRemix, onDiscard, isOwner }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="secondary"
        className="w-full"
        onClick={onDownload}
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
      <Button
        variant="secondary"
        className="w-full"
        onClick={onRemix}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Remix
      </Button>
      {isOwner && (
        <Button
          variant="destructive"
          className="w-full col-span-2"
          onClick={onDiscard}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Discard
        </Button>
      )}
    </div>
  );
};

export default ImageActions;