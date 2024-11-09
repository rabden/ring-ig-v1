import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2 } from "lucide-react";

const MobileImageActions = ({ session, onDownload, isOwner, onDiscard, onRemix }) => {
  if (!session) return null;

  return (
    <div className="flex gap-2 justify-between mb-6">
      <Button variant="ghost" size="sm" className="flex-1" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      {isOwner && (
        <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={onDiscard}>
          <Trash2 className="mr-2 h-4 w-4" />
          Discard
        </Button>
      )}
      <Button variant="ghost" size="sm" className="flex-1" onClick={onRemix}>
        <Wand2 className="mr-2 h-4 w-4" />
        Remix
      </Button>
    </div>
  );
};

export default MobileImageActions;